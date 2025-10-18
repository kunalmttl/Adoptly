// src/components/pets/PetImageGallery.tsx

import { useState, useEffect } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

/**
 * Props for the PetImageGallery component.
 */
interface PetImageGalleryProps {
  /** An array of image URLs for the gallery. */
  images: string[];
  /** The name of the pet, used for alt text. */
  petName: string;
}

/**
 * A component that displays a main image and a series of clickable thumbnails.
 * It is designed to handle asynchronously loaded image data.
 */
export const PetImageGallery = ({ images, petName }: PetImageGalleryProps) => {
  // State to track the URL of the currently displayed main image.
  const [mainImage, setMainImage] = useState<string>('/placeholder-pet.jpg');

  /**
   * Effect to synchronize the component's state with its props.
   * When the `images` prop is populated (e.g., after an API call), this effect
   * updates the `mainImage` state to display the first image from the array.
   */
  useEffect(() => {
    if (images?.length > 0) {
      setMainImage(images[0]);
    }
  }, [images]); // This effect re-runs whenever the 'images' array prop changes.

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

      {/* Main Image Display */}
      <div className="w-full">
        <AspectRatio ratio={1 / 1}>
          <img src={mainImage} alt={petName} className="h-full w-full rounded-xl object-cover" />
        </AspectRatio>
      </div>
    </div>
  );
};