"use client";

import Image from "next/image";

/**
 * Safe, immediate product image rendering.
 * Do not run background segmentation in Safari at runtime.
 * Only the home carousel uses this component; originals are kept intact.
 * When verified static transparent assets exist, use their public URLs in src.
 */
export default function CutoutGarment({
  src,
  alt,
  className,
  priority = false,
  sizes,
  visible,
}: {
  src: string;
  alt: string;
  className: string;
  priority?: boolean;
  sizes: string;
  visible: boolean;
}) {
  return (
    <Image
      src={src}
      alt={visible ? alt : ""}
      fill
      unoptimized
      draggable={false}
      priority={priority}
      sizes={sizes}
      className={className}
    />
  );
}
