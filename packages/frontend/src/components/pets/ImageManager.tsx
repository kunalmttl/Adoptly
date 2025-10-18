// src/components/pets/ImageManager.tsx

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { getCloudinarySignature, uploadToCloudinary } from '@/api/uploadAPI';

/**
 * Props for the ImageManager component.
 */
interface ImageManagerProps {
  /** An array of initial image URLs to display. */
  initialImages: string[];
  /** A callback function to notify the parent form of any changes to the image list. */
  onImageChange: (newImageUrls: string[]) => void;
}

/**
 * A component for managing and uploading images directly to Cloudinary.
 * It provides a dropzone for new uploads, displays existing images,
 * and allows for image removal.
 */
export const ImageManager = ({ initialImages, onImageChange }: ImageManagerProps) => {
  const [imageUrls, setImageUrls] = useState<string[]>(initialImages);
  const [isUploading, setIsUploading] = useState(false);

  /**
   * Handles the dropping of files onto the dropzone.
   * This function orchestrates the entire upload process to Cloudinary.
   */
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setIsUploading(true);
    const toastId = toast.loading(`Uploading ${acceptedFiles.length} image(s)...`);

    try {
      // Step 1: Get a temporary signature from our backend to authorize the upload.
      const { signature, timestamp } = await getCloudinarySignature();

      // Step 2: Create an array of upload promises, one for each file.
      const uploadPromises = acceptedFiles.map(file =>
        uploadToCloudinary(file, signature, timestamp, (progressEvent) => {
          // Optional: Implement a progress bar using this data.
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Upload Progress: ${percentCompleted}%`);
          }
        })
      );

      // Step 3: Wait for all files to finish uploading to Cloudinary.
      const newUrls = await Promise.all(uploadPromises);

      // Step 4: Update the local state and notify the parent form.
      const finalUrls = [...imageUrls, ...newUrls];
      setImageUrls(finalUrls);
      onImageChange(finalUrls);

      toast.success('Images uploaded successfully!', { id: toastId });
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Image upload failed. Please try again.', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  }, [imageUrls, onImageChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 5,
    disabled: isUploading,
  });

  /**
   * Removes an image from the list and updates the parent form.
   * @param urlToRemove - The URL of the image to be removed.
   */
  const removeImage = (urlToRemove: string) => {
    const newImageUrls = imageUrls.filter(url => url !== urlToRemove);
    setImageUrls(newImageUrls);
    onImageChange(newImageUrls);
  };

  return (
    <div className="space-y-4">
      <label className="font-medium">Images</label>
      <div {...getRootProps()} className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors ${isDragActive ? 'border-orange-500 bg-orange-50' : 'border-neutral-300 hover:border-neutral-400'} ${isUploading ? 'cursor-not-allowed opacity-50' : ''}`}>
        <input {...getInputProps()} />
        {isUploading ? <Loader2 className="h-12 w-12 text-neutral-400 animate-spin" /> : <UploadCloud className="h-12 w-12 text-neutral-400" />}
        <p className="mt-4 font-semibold">{isUploading ? 'Uploading...' : isDragActive ? 'Drop files here...' : 'Drag & drop or click to upload'}</p>
        <p className="text-xs text-neutral-500">Max 5 images</p>
      </div>

      {imageUrls.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
              <img src={url} alt={`Pet image ${index + 1}`} className="h-full w-full object-cover" />
              <button type="button" onClick={() => removeImage(url)} className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/50 text-white flex items-center justify-center transition-colors hover:bg-red-500">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};