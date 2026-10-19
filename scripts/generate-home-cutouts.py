#!/usr/bin/env python3
"""Generate real transparent PNGs for the homepage carousel at build/preparation time.

This is intentionally NOT run in the user's browser: iPhone Safari must only
load ready-made images. The original mockups stay untouched for the configurator.
"""
from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageChops, ImageOps
import argparse
from rembg import new_session, remove

ROOT = Path(__file__).resolve().parents[1]
INPUT = ROOT / "public" / "designer-mockups"
OUTPUT = ROOT / "public" / "home-cutouts"

PRODUCTS = {
    "tshirt-oversized": "tshirt_oversized_new.png",
    "hoodie": "hoodie_new.png",
    "gilet": "gilet.png",
    "polo": "polo.jpg",
    "tshirt": "tshirt.png",
    "casquette": "casquette_new.png",
    "tote-bag": "totebag_new.png",
}


def process(session, name: str, filename: str) -> None:
    input_path = INPUT / filename
    if not input_path.is_file():
        raise FileNotFoundError(input_path)

    source = Image.open(input_path).convert("RGBA")
    # Keep detail while avoiding needlessly huge static files.
    source.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
    extracted = remove(
        source,
        session=session,
        alpha_matting=True,
        alpha_matting_foreground_threshold=240,
        alpha_matting_background_threshold=10,
        alpha_matting_erode_size=6,
        post_process_mask=True,
    ).convert("RGBA")

    alpha = extracted.getchannel("A")
    if name == "tshirt-oversized":
        # The model erases the RIGHT SLEEVE of this otherwise complete source
        # photograph. Rebuild *only its alpha mask* from the intact left side.
        # Keep original photograph pixels, so the right sleeve keeps its own
        # fabric lighting and folds rather than duplicating the image.
        midpoint = source.width // 2
        mirrored_alpha = ImageOps.mirror(alpha)
        original_right = alpha.crop((midpoint, 0, source.width, source.height))
        mirrored_right = mirrored_alpha.crop((midpoint, 0, source.width, source.height))
        repaired = ImageChops.lighter(original_right, mirrored_right)
        alpha.paste(repaired, (midpoint, 0))
        extracted.putalpha(alpha)
        print("Repaired oversized right sleeve using mirrored left-side alpha mask.")
    # Guard against the original bug (a totally transparent rectangle).
    hist = alpha.histogram()
    total = extracted.width * extracted.height
    visible = sum(hist[36:]) / total
    opaque = sum(hist[205:]) / total
    transparent = sum(hist[:20]) / total
    if not (0.055 < visible < 0.85 and opaque > 0.035 and transparent > 0.07):
        raise RuntimeError(
            f"{name} segmentation failed: visible={visible:.2%}, "
            f"opaque={opaque:.2%}, transparent={transparent:.2%}"
        )

    # Cropping the transparent padding makes the garment as large as possible in
    # carousel frames; transparent margin retained so sleeves don't clip.
    bbox = alpha.point(lambda px: 255 if px > 25 else 0).getbbox()
    if bbox is None:
        raise RuntimeError(f"{name} resulted in empty alpha.")
    # Oversized sleeves need generous invisible breathing room.
    pad_ratio = 0.09 if name == "tshirt-oversized" else 0.055
    pad = max(30, int(min(source.size) * pad_ratio))
    cropped = extracted.crop((
        max(0, bbox[0] - pad), max(0, bbox[1] - pad),
        min(extracted.width, bbox[2] + pad),
        min(extracted.height, bbox[3] + pad),
    ))

    OUTPUT.mkdir(parents=True, exist_ok=True)
    destination = OUTPUT / f"{name}.png"
    cropped.save(destination, "PNG", optimize=True, compress_level=9)
    print(
        f"OK {name}: {source.width}x{source.height} -> "
        f"{cropped.width}x{cropped.height}; alpha coverage "
        f"{visible:.1%}; {destination.stat().st_size // 1024} KiB"
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--only", nargs="*", choices=sorted(PRODUCTS))
    args = parser.parse_args()
    targets = args.only if args.only else list(PRODUCTS)
    # One model session, but only regenerate the two changed articles.
    session = new_session("u2net")
    for name in targets:
        process(session, name, PRODUCTS[name])


if __name__ == "__main__":
    main()
