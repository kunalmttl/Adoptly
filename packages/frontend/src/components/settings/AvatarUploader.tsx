// src/components/settings/AvatarUploader.tsx

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { Camera, Loader2 } from 'lucide-react';

import { useAuthStore } from '@/store/authStore';
import { uploadImagesToServer } from '@/api/uploadAPI'; // Using the server upload for simplicity
import { updateMyAvatar } from '@/api/userAPI';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

/**
 * Props for the AvatarUploader component.
 */
interface AvatarUploaderProps {
  /** The source URL for the current avatar image. */
  src?: string;
  /** The fallback text (initials) to display if the image fails to load. */
  fallback: string;
}

/**
 * A component that allows users to upload a new avatar.
 * It displays the current avatar and provides a dropzone for uploading a new image.
 * On successful upload, it updates the user's profile and the global auth state.
 */
export const AvatarUploader = ({ src, fallback }: AvatarUploaderProps) => {
  const { setUser } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);

  /**
   * Handles the file drop event to upload the new avatar.
   */
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      setIsUploading(true);

      // Use toast.promise for a clean loading/success/error UI.
      const uploadPromise = uploadImagesToServer([file]).then(async (uploadResponse) => {
        // Step 1: Get the new image URL from our backend.
        const imageUrl = uploadResponse.urls[0];

        // Step 2: Send this new URL to the backend to update the user's profile.
        const updatedUser = await updateMyAvatar(imageUrl);

        // Step 3: Update the global user state in Zustand. This will automatically
        // re-render all components that use this state (e.g., the navbar avatar).
        setUser(updatedUser);

        return updatedUser; // Pass the user object to the toast's success handler.
      });

      toast.promise(uploadPromise, {
        loading: 'Uploading new avatar...',
        success: 'Avatar updated successfully!',
        error: 'Failed to update avatar. Please try again.',
      });

      // Note: isUploading is managed implicitly by the promise toast.
      // We can set it to false here for safety, but the UI is driven by the toast state.
      setIsUploading(false);
    },
    [setUser]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false, // Only allow a single file.
    disabled: isUploading,
  });

  return (
    <div className="flex flex-col items-center space-y-4">
      <div {...getRootProps()} className="relative cursor-pointer rounded-full group">
        <input {...getInputProps()} />

        <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
          <AvatarImage src={src} />
          <AvatarFallback className="text-4xl">{fallback}</AvatarFallback>
        </Avatar>

        {/* Hover Overlay and Icon */}
        <div className="absolute inset-0 flex h-full w-full items-center justify-center rounded-full bg-black/0 transition-all group-hover:bg-black/40">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white opacity-0 transition-opacity group-hover:opacity-100">
            {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
          </div>
        </div>
      </div>
      <p className="text-center text-sm text-neutral-500">Click or drag an image to upload.</p>
    </div>
  );
};