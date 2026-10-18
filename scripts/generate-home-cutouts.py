#!/usr/bin/env python3
"""Generate real transparent PNGs for the homepage carousel at build/preparation time.

This is intentionally NOT run in the user's browser: iPhone Safari must only
load ready-made images. The original mockups stay untouched for the configurator.
"""
from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageChops
from rembg import new_session, remove

ROOT = Path(__file__).resolve().parents[1]
INPUT = ROOT / "public" / "designer-mockups"
OUTPUT = ROOT / "public" / "home-cutouts"

PRODUCTS = {
    "tshirt-oversized": "tshirt_oversized_new.png",
    "hoodie": "hoodie_new.png",
    "gilet": "gilet.png",
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
    pad = max(18, int(min(source.size) * 0.035))
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
    # One reusable model session for all six articles, precomputed off-line.
    session = new_session("u2net")
    for name, filename in PRODUCTS.items():
        process(session, name, filename)


if __name__ == "__main__":
    main()
