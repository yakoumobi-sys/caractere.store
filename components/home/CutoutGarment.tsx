"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getCutoutProduct } from "@/lib/remove-product-background";

/**
 * Product renders only after a transparent, isolated version has been prepared.
 * The original image is never modified, so the configurator remains unchanged.
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
  const [readySource, setReadySource] = useState<string | null>(null);

  useEffect(() => {
    if (!visible || readySource) return;
    let alive = true;
    getCutoutProduct(src).then((url) => {
      if (alive) setReadySource(url);
    });
    return () => { alive = false; };
  }, [src, visible, readySource]);

  if (!readySource) return null;

  return (
    <Image
      src={readySource}
      alt={alt}
      fill
      unoptimized
      draggable={false}
      priority={priority}
      sizes={sizes}
      className={className}
    />
  );
}
