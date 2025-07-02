// # Image Uploader Component

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { UploadCloud, Loader2 } from 'lucide-react';

import { uploadImages } from '@/api/uploadAPI';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

// * Define the props for communication with the parent form
interface ImageUploaderProps {
  onImagesUploaded: (urls: string[]) => void;
}

export const ImageUploader = ({ onImagesUploaded }: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setIsUploading(true);
    const uploadPromise = uploadImages(acceptedFiles);

    toast.promise(uploadPromise, {
      loading: 'Uploading images...',
      success: (data) => {
        onImagesUploaded(data.urls); // Communicate the new URLs to the parent
        setIsUploading(false);
        return `${acceptedFiles.length} image(s) uploaded successfully!`;
      },
      error: (_error) => {
        setIsUploading(false);
        console.log(_error);
        return 'Upload failed. Please try again.';
      },
    });
  }, [onImagesUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 5,
    disabled: isUploading,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload More Images</CardTitle>
        <CardDescription>You can add more images to your listing.</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors ${isDragActive ? 'border-indigo-600 bg-indigo-50' : 'border-neutral-300 hover:border-neutral-400'} ${isUploading ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <Loader2 className="h-12 w-12 animate-spin text-neutral-400" />
          ) : (
            <UploadCloud className="h-12 w-12 text-neutral-400" />
          )}
          <p className="mt-4 font-semibold">
            {isUploading ? 'Uploading...' : isDragActive ? 'Drop the files here...' : 'Drag & drop files, or click to browse'}
          </p>
          <p className="text-xs text-neutral-500">PNG, JPG, WEBP up to 10MB</p>
        </div>
      </CardContent>
    </Card>
  );
};