// src/components/pets/PetImageGallery.tsx
import { useState } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface PetImageGalleryProps 
{
  images: string[];
  petName: string;
}

export const PetImageGallery = ({ images, petName }: PetImageGalleryProps) => 
{
  // State to track the currently displayed main image

  const [mainImage, setMainImage] = useState(images[0] ? `http://localhost:3000${images[0]}` : '/placeholder-pet.jpg');

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[80px_1fr]">
      {/* Thumbnail Column */}
      <div className="order-last flex gap-4 lg:order-first lg:flex-col">
        {images.map((src, index) => (
          <button key={index} onClick={() => setMainImage(src)} className="overflow-hidden rounded-lg">
            <AspectRatio ratio={1 / 1}>
              <img
                src={src}
                alt={`${petName} thumbnail ${index + 1}`}
                className={`h-full w-full object-cover transition-opacity hover:opacity-75 ${mainImage === src ? 'ring-2 ring-orange-500 ring-offset-2' : ''}`}
              />
            </AspectRatio>
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="w-full">
        <AspectRatio ratio={1 / 1}>
          <img
            src={mainImage}
            alt={petName}
            className="h-full w-full rounded-xl object-cover"
          />
        </AspectRatio>
      </div>
    </div>
  );
};