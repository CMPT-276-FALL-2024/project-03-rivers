"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";

interface ImageCardProps {
  imageUrl: string;
}

export function ImageCard({ imageUrl }: ImageCardProps) {
  const [imgSrc, setImgSrc] = React.useState(imageUrl);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setImgSrc(imageUrl);
    setIsLoading(true);
    setHasError(false);
  }, [imageUrl]);

  const handleError = () => {
    console.error('Image failed to load:', imgSrc);
    setHasError(true);
    setIsLoading(false);
  };

  return (
    <Card className="border border-gray-200 shadow-lg h-[380px] p-0 m-0">
      <div className="relative w-full h-full">
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            Loading...
          </div>
        )}
        {!hasError && (
          <Image
            src={imgSrc}
            alt="Food Image"
            fill
            className={`rounded-lg object-cover transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoadingComplete={() => setIsLoading(false)}
            onError={handleError}
          />
        )}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
            No Image Available
          </div>
        )}
      </div>
    </Card>
  );
}

