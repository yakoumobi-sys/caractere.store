/**
 * Turns legacy studio mockups into isolated garments.
 * The original source images remain unchanged for the configurator.
 *
 * Approach: compare pixels with a bilinear approximation of the photograph's
 * border/background, close small contour gaps, retain the biggest object,
 * and preserve the object's interior (including white fabric).
 */
const processed = new Map<string, Promise<string>>();
type Pixel = [number, number, number];

function morph(input: Uint8Array, width: number, height: number, radius: number, horizontal: boolean, dilation: boolean): Uint8Array {
  const result = new Uint8Array(input.length);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let found = dilation ? 0 : 1;
      for (let offset = -radius; offset <= radius; offset += 1) {
        const xx = horizontal ? x + offset : x;
        const yy = horizontal ? y : y + offset;
        const value = xx < 0 || yy < 0 || xx >= width || yy >= height ? 0 : input[yy * width + xx];
        if (dilation && value) { found = 1; break; }
        if (!dilation && !value) { found = 0; break; }
      }
      result[y * width + x] = found;
    }
  }
  return result;
}

function closeSmallGaps(binary: Uint8Array, width: number, height: number) {
  const radius = Math.max(3, Math.min(9, Math.round(Math.min(width, height) / 53)));
  let mask = morph(binary, width, height, radius, true, true);
  mask = morph(mask, width, height, radius, false, true);
  mask = morph(mask, width, height, radius, true, false);
  return morph(mask, width, height, radius, false, false);
}

function isolateLargestGarment(binary: Uint8Array, width: number, height: number, keepHandleHole: boolean): Uint8Array | null {
  const count = width * height;
  const seen = new Uint8Array(count);
  const queue = new Int32Array(count);
  let largestSize = 0;
  let largestIndex = -1;
  const directions = [-1, 1, -width, width];

  function walk(start: number, pixels: Uint8Array, visited: Uint8Array, collect: boolean) {
    let head = 0;
    let tail = 1;
    queue[0] = start;
    visited[start] = 1;
    let touchesEdge = false;
    let verticalSum = 0;
    while (head < tail) {
      const p = queue[head++];
      const x = p % width;
      const y = Math.floor(p / width);
      verticalSum += y;
      if (x === 0 || y === 0 || x === width - 1 || y === height - 1) touchesEdge = true;
      for (let i = 0; i < 4; i += 1) {
        if (i === 0 && x === 0) continue;
        if (i === 1 && x === width - 1) continue;
        if (i === 2 && y === 0) continue;
        if (i === 3 && y === height - 1) continue;
        const next = p + directions[i];
        if (!visited[next] && pixels[next] === pixels[start]) {
          visited[next] = 1;
          queue[tail++] = next;
        }
      }
    }
    return { size: tail, touchesEdge, middleY: verticalSum / tail, points: collect ? queue.slice(0, tail) : null };
  }

  for (let i = 0; i < count; i += 1) {
    if (!binary[i] || seen[i]) continue;
    const component = walk(i, binary, seen, false);
    if (component.size > largestSize) {
      largestSize = component.size;
      largestIndex = i;
    }
  }

  if (largestIndex < 0 || largestSize < count * 0.025 || largestSize > count * 0.86) return null;
  const mask = new Uint8Array(count);
  const visitedGarment = new Uint8Array(count);
  const winner = walk(largestIndex, binary, visitedGarment, true);
  for (let j = 0; j < winner.points!.length; j += 1) mask[winner.points![j]] = 1;

  // Fabric interiors are often the same shade as the backdrop. Fill enclosed
  // empty islands rather than producing transparent holes in white clothing.
  const seenHoles = new Uint8Array(count);
  for (let i = 0; i < count; i += 1) {
    if (mask[i] || seenHoles[i]) continue;
    const hole = walk(i, mask, seenHoles, true);
    const realBagOpening = keepHandleHole && hole.size > count * 0.012 && hole.middleY < height * 0.52;
    if (!hole.touchesEdge && !realBagOpening) {
      for (let j = 0; j < hole.points!.length; j += 1) mask[hole.points![j]] = 1;
    }
  }
  return mask;
}

function sampleColor(data: Uint8ClampedArray, width: number, height: number, centerX: number, centerY: number): Pixel {
  let r = 0; let g = 0; let b = 0; let n = 0;
  for (let dy = -2; dy <= 2; dy += 1) {
    for (let dx = -2; dx <= 2; dx += 1) {
      const x = Math.max(0, Math.min(width - 1, centerX + dx));
      const y = Math.max(0, Math.min(height - 1, centerY + dy));
      const p = (y * width + x) * 4;
      r += data[p]; g += data[p + 1]; b += data[p + 2]; n += 1;
    }
  }
  return [r / n, g / n, b / n];
}

async function processSource(src: string): Promise<string> {
  if (typeof window === "undefined") return src;
  return new Promise<string>((resolve) => {
    const photo = new window.Image();
    photo.decoding = "async";
    photo.onload = () => {
      try {
        const maxSampleSize = 360;
        const sampleScale = Math.min(1, maxSampleSize / Math.max(photo.naturalWidth, photo.naturalHeight));
        const width = Math.max(1, Math.round(photo.naturalWidth * sampleScale));
        const height = Math.max(1, Math.round(photo.naturalHeight * sampleScale));
        const sampleCanvas = document.createElement("canvas");
        sampleCanvas.width = width;
        sampleCanvas.height = height;
        const sctx = sampleCanvas.getContext("2d", { willReadFrequently: true });
        if (!sctx) { resolve(src); return; }
        sctx.drawImage(photo, 0, 0, width, height);
        const pixels = sctx.getImageData(0, 0, width, height);
        const data = pixels.data;
        const corners = [
          sampleColor(data, width, height, Math.round(width * .025), Math.round(height * .025)),
          sampleColor(data, width, height, Math.round(width * .975), Math.round(height * .025)),
          sampleColor(data, width, height, Math.round(width * .025), Math.round(height * .975)),
          sampleColor(data, width, height, Math.round(width * .975), Math.round(height * .975)),
        ];
        // Existing alpha is preferable to guessing a new one.
        if (data[(Math.round(height * .025) * width + Math.round(width * .025)) * 4 + 3] < 235) {
          resolve(src);
          return;
        }
        const binary = new Uint8Array(width * height);
        const minDimension = Math.min(width, height);
        if (minDimension < 80) { resolve(src); return; }
        for (let y = 0; y < height; y += 1) {
          const ty = y / Math.max(1, height - 1);
          for (let x = 0; x < width; x += 1) {
            const tx = x / Math.max(1, width - 1);
            const p = (y * width + x) * 4;
            const topR = corners[0][0] * (1 - tx) + corners[1][0] * tx;
            const topG = corners[0][1] * (1 - tx) + corners[1][1] * tx;
            const topB = corners[0][2] * (1 - tx) + corners[1][2] * tx;
            const bgR = topR * (1 - ty) + (corners[2][0] * (1 - tx) + corners[3][0] * tx) * ty;
            const bgG = topG * (1 - ty) + (corners[2][1] * (1 - tx) + corners[3][1] * tx) * ty;
            const bgB = topB * (1 - ty) + (corners[2][2] * (1 - tx) + corners[3][2] * tx) * ty;
            const dr = data[p] - bgR;
            const dg = data[p + 1] - bgG;
            const db = data[p + 2] - bgB;
            binary[y * width + x] = Math.sqrt(dr * dr + dg * dg + db * db) > 12 ? 1 : 0;
          }
        }
        const closed = closeSmallGaps(binary, width, height);
        const mask = isolateLargestGarment(closed, width, height, /tote/i.test(src));
        if (!mask) { resolve(src); return; }

        const alphaCanvas = document.createElement("canvas");
        alphaCanvas.width = width;
        alphaCanvas.height = height;
        const alphaContext = alphaCanvas.getContext("2d");
        if (!alphaContext) { resolve(src); return; }
        const alphaPixels = alphaContext.createImageData(width, height);
        for (let i = 0; i < mask.length; i += 1) {
          const offset = i * 4;
          alphaPixels.data[offset] = 255;
          alphaPixels.data[offset + 1] = 255;
          alphaPixels.data[offset + 2] = 255;
          alphaPixels.data[offset + 3] = mask[i] ? 255 : 0;
        }
        alphaContext.putImageData(alphaPixels, 0, 0);

        const outputScale = Math.min(1, 1450 / Math.max(photo.naturalWidth, photo.naturalHeight));
        const resultWidth = Math.round(photo.naturalWidth * outputScale);
        const resultHeight = Math.round(photo.naturalHeight * outputScale);
        const output = document.createElement("canvas");
        output.width = resultWidth;
        output.height = resultHeight;
        const ctx = output.getContext("2d");
        if (!ctx) { resolve(src); return; }
        ctx.drawImage(photo, 0, 0, resultWidth, resultHeight);
        ctx.globalCompositeOperation = "destination-in";
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(alphaCanvas, 0, 0, resultWidth, resultHeight);
        ctx.globalCompositeOperation = "source-over";
        output.toBlob((blob) => resolve(blob ? URL.createObjectURL(blob) : src), "image/png");
      } catch {
        resolve(src);
      }
    };
    photo.onerror = () => resolve(src);
    photo.src = src;
  });
}

export function getCutoutProduct(src: string): Promise<string> {
  let value = processed.get(src);
  if (!value) {
    value = processSource(src);
    processed.set(src, value);
  }
  return value;
}
