// src/components/pets/ImageManager.tsx

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { getCloudinarySignature, uploadToCloudinary } from '@/api/uploadAPI';
import toast from 'react-hot-toast';


// Define the props it will receive from the form
interface ImageManagerProps {
  initialImages: string[];
  onImageChange: (newImageUrls: string[]) => void;
}

export const ImageManager = ({ initialImages, onImageChange }: ImageManagerProps) => {
  // State to hold the list of image URLs (both existing and newly uploaded)
  const [imageUrls, setImageUrls] = useState<string[]>(initialImages);
  const [isUploading, setIsUploading] = useState(false);



  // We will add the upload logic here in the next step
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    const toastId = toast.loading(`Uploading ${acceptedFiles.length} image(s)...`);

    try {
      // 1. Get the signature from our backend
      const { signature, timestamp } = await getCloudinarySignature();

      // 2. Create an array of upload promises
      const uploadPromises = acceptedFiles.map(file => 
        uploadToCloudinary(file, signature, timestamp, (progressEvent) => {
          // Optional: You can implement a progress bar here
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload Progress: ${percentCompleted}%`);
        })
      );

      // 3. Wait for all uploads to complete
      const newUrls = await Promise.all(uploadPromises);
      
      // 4. Update the state and notify the parent form
      const finalUrls = [...imageUrls, ...newUrls];
      setImageUrls(finalUrls);
      onImageChange(finalUrls);

      toast.success("Images uploaded successfully!", { id: toastId });

    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Image upload failed. Please try again.", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  }, [imageUrls, onImageChange]);


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 5,
  });

  const removeImage = (urlToRemove: string) => {
    const newImageUrls = imageUrls.filter(url => url !== urlToRemove);
    setImageUrls(newImageUrls);
    onImageChange(newImageUrls); // Notify the parent form of the change
  };

  return (
    <div className="space-y-4">
      <label className="font-medium font-montserrat">Images</label>
      
      {/* Dropzone Area */}
      <div 
        {...getRootProps()} 
        className={`flex cursor-pointer flex-col items-center justify-center mt-3 rounded-lg border-2 border-dashed p-8 text-center transition-colors ${isDragActive ? 'border-indigo-600 bg-indigo-50' : 'border-neutral-300 hover:border-neutral-400'}`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <Loader2 className="h-12 w-12 text-neutral-400 animate-spin" />
        ) : (
          <UploadCloud className="h-12 w-12 text-neutral-400" />
        )}
        <p className="mt-4 font-semibold font-montserrat ">
          {isUploading ? 'Uploading...' : (isDragActive ? 'Drop files here...' : 'Drag & drop or click to upload')}
        </p>
        <p className="text-xs text-neutral-500 font-mono">Max 5 images</p>
      </div>

      {/* Image Previews */}
      {imageUrls.length > 0 && (
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
              <img src={url} alt={`Pet image ${index + 1}`} className="h-full w-full object-cover" />
              <button 
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/50 text-white flex items-center justify-center transition-colors hover:bg-red-500"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};