// # Pet Image Gallery Component

import { useState, useEffect } from 'react'; // * Import useEffect
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface PetImageGalleryProps {
  images: string[];
  petName: string;
}

export const PetImageGallery = ({ images, petName }: PetImageGalleryProps) => {
  // * State to track the currently displayed main image
  const [mainImage, setMainImage] = useState<string>('/placeholder-pet.jpg');

  // ! FIX: Use an effect to update the main image when the images prop is populated from the API.
  // ? This synchronizes the component's state with its props.
  useEffect(() => {
    if (images && images.length > 0) {
      setMainImage(images[0]);
    }
  }, [images]); // =-= This effect runs whenever the 'images' array changes.

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[80px_1fr]">
      {/* Thumbnail Column */}
      <div className="order-last flex gap-4 lg:order-first lg:flex-col">
        {images.map((src, index) => (
          // =-= The onClick now correctly sets the relative path, which is what we want.
          <button key={index} onClick={() => setMainImage(src)} className="overflow-hidden rounded-lg">
            <AspectRatio ratio={1 / 1}>
              <img
                // =-= The src uses the relative path, which the Vite proxy will handle.
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
            // =-= This now correctly uses the mainImage state, which is a relative path.
            src={mainImage}
            alt={petName}
            className="h-full w-full rounded-xl object-cover"
          />
        </AspectRatio>
      </div>
    </div>
  );
};