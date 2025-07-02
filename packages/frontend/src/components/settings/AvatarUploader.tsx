// src/components/settings/AvatarUploader.tsx

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

import { useAuthStore } from "@/store/authStore";
import { uploadImages } from "@/api/uploadAPI";
import { updateMyAvatar } from "@/api/userAPI";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";

// Define the props it will receive
interface AvatarUploaderProps {
  src?: string;
  fallback: string;
}

export const AvatarUploader = ({ src, fallback }: AvatarUploaderProps) => {
  // Get the 'setUser' function from our global store to update the state directly
  const { setUser } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setIsUploading(true);

    const uploadPromise = uploadImages([file]).then(async (uploadResponse) => {
      // 1. Get the new URL from Cloudinary
      const imageUrl = uploadResponse.urls[0];
      
      // 2. Send the URL to our backend to update the user
      const updatedUser = await updateMyAvatar(imageUrl);
      
      // 3. Update the global state directly. This will cause all components
      // (like the navbar and the settings page) to re-render with the new data.
      setUser(updatedUser);

      return updatedUser; // Return for the toast promise
    });

    toast.promise(uploadPromise, {
      loading: 'Uploading new avatar...',
      success: 'Avatar updated successfully!',
      error: 'Failed to update avatar. Please try again.',
    });

    setIsUploading(false);

  }, [setUser]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  return (
    <div className="flex flex-col items-center space-y-4">
      <div {...getRootProps()} className="relative cursor-pointer rounded-full group">
        <input {...getInputProps()} />
        
        <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
          <AvatarImage src={src} />
          <AvatarFallback className="text-4xl">{fallback}</AvatarFallback>
        </Avatar>
        
        {/* Overlay and Icon */}
        <div className="absolute inset-0 flex h-full w-full items-center justify-center rounded-full bg-black/0 transition-all group-hover:bg-black/40">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white opacity-0 transition-opacity group-hover:opacity-100">
            {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
          </div>
        </div>
      </div>
      <p className="text-center text-sm text-neutral-500">
        Click or drag an image to upload.
      </p>
    </div>
  );
};