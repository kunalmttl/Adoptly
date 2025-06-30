// # Avatar Uploader Component

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

import { useAuthStore } from "@/store/authStore";
import { uploadImages } from "@/api/uploadAPI";
import { updateMyProfile } from "@/api/userAPI";
import type { User } from "@/store/authStore";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";

interface AvatarUploaderProps {
  src?: string;
  fallback: string;
  // ! NEW: Add a callback prop to notify the parent page of the update.
  onUploadSuccess: (updatedUser: User & { picture?: string }) => void;
}

export const AvatarUploader = ({ src, fallback, onUploadSuccess }: AvatarUploaderProps) => {
  const { setUser } = useAuthStore();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];

    const uploadPromise = uploadImages([file]).then(async (uploadResponse) => {
      const imageUrl = uploadResponse.urls[0];
      const updatedUser = await updateMyProfile({ picture: imageUrl });
      
      // * Update the global user state
      setUser(updatedUser);
      
      // ! FIX: Call the parent's callback function with the new user data.
      onUploadSuccess(updatedUser);

      return updatedUser;
    });

    toast.promise(uploadPromise, {
      loading: 'Uploading new avatar...',
      success: 'Avatar updated successfully!',
      error: 'Failed to update avatar. Please try again.',
    });

  }, [setUser, onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  return (
    <div className="flex flex-col items-center space-y-4">
      <div {...getRootProps()} className="relative cursor-pointer">
        <input {...getInputProps()} />
        
        <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
          <AvatarImage src={src ? `http://localhost:3000${src}` : ''} />
          <AvatarFallback className="text-4xl">{fallback}</AvatarFallback>
        </Avatar>
        
        <div className="absolute bottom-0 right-0 rounded-full bg-primary text-primary-foreground p-2 pointer-events-none">
          {isDragActive ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
        </div>
      </div>
      <p className="text-sm text-neutral-500 text-center">
        Click the camera or drag an image here to upload.
      </p>
    </div>
  );
};