
"use client";

import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";

interface ImageWithLoaderProps extends Omit<ImageProps, "src"> {
  src?: ImageProps["src"] | null;
}

export function ImageWithLoader({
  src,
  alt = "Image",
  className = "",
  onLoad,
  onError,
  ...props
}: ImageWithLoaderProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [src]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Placeholder */}
      {(!loaded || error || !src) && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#e5e5e5]">
          <svg
            width="100"
            height="75"
            viewBox="0 0 100 75"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 55L35 20L55 55H10Z"
              fill="white"
            />
            <path
              d="M35 55L62 28L90 55H35Z"
              fill="white"
            />
            <circle cx="59" cy="27" r="8" fill="#BDBDBD" />
          </svg>
        </div>
      )}

      {/* Actual Image */}
      {src && !error && (
        <Image
          {...props}
          src={src}
          alt={alt}
          className={`transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          } ${className}`}
          onLoad={(event) => {
            setLoaded(true);
            onLoad?.(event);
          }}
          onError={(event) => {
            setError(true);
            onError?.(event);
          }}
        />
      )}
    </div>
  );
}
