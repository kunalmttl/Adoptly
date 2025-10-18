// src/components/pets/ImageUploader.tsx

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { UploadCloud, X, Loader2 } from 'lucide-react';

import { uploadImagesToServer } from '@/api/uploadAPI';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

/**
 * Props for the ImageUploader component.
 */
interface ImageUploaderProps {
  /** A callback function to notify the parent form when uploads are complete. */
  onUploadComplete: (urls: string[]) => void;
}

/**
 * A component for uploading images directly to the application's backend server.
 * It provides a user-friendly dropzone interface and displays image previews.
 */
export const ImageUploader = ({ onUploadComplete }: ImageUploaderProps) => {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  /**
   * Handles the dropping of files and initiates the upload process to the server.
   */
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setIsUploading(true);
    const uploadPromise = uploadImagesToServer(acceptedFiles);

    toast.promise(uploadPromise, {
      loading: 'Uploading images...',
      success: (data) => {
        const newUrls = [...uploadedUrls, ...data.urls];
        setUploadedUrls(newUrls);
        onUploadComplete(newUrls); // Communicate the full list of URLs to the parent.
        setIsUploading(false);
        return `${acceptedFiles.length} image(s) uploaded successfully!`;
      },
      error: (error) => {
        setIsUploading(false);
        console.error('Upload failed:', error);
        return 'Upload failed. Please try again.';
      },
    });
  }, [uploadedUrls, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 5,
    disabled: isUploading,
  });

  /**
   * Removes an image from the preview list and updates the parent form.
   */
  const removeImage = (urlToRemove: string) => {
    const newUrls = uploadedUrls.filter(url => url !== urlToRemove);
    setUploadedUrls(newUrls);
    onUploadComplete(newUrls);
  };

  // Note: The image src is constructed for a local dev environment.
  // In production, this would likely point to a CDN or a different base URL.
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pet Images</CardTitle>
        <CardDescription>Upload at least one main image and up to four others.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div {...getRootProps()} className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors ${isDragActive ? 'border-orange-500 bg-orange-50' : 'border-neutral-300 hover:border-neutral-400'} ${isUploading ? 'cursor-not-allowed opacity-50' : ''}`}>
          <input {...getInputProps()} />
          {isUploading ? <Loader2 className="h-12 w-12 animate-spin text-neutral-400" /> : <UploadCloud className="h-12 w-12 text-neutral-400" />}
          <p className="mt-4 font-semibold">{isUploading ? 'Uploading...' : isDragActive ? 'Drop files here...' : 'Drag & drop or click to browse'}</p>
          <p className="text-xs text-neutral-500">Max 5 images</p>
        </div>

        {uploadedUrls.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {uploadedUrls.map((url, index) => (
              <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                <img src={`${apiBaseUrl.replace('/api/v1', '')}${url}`} alt={`Preview ${index}`} className="h-full w-full object-cover" />
                <button type="button" onClick={() => removeImage(url)} className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/50 text-white flex items-center justify-center transition-colors hover:bg-red-500">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};