// # Image Uploader Component

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { UploadCloud, X, Loader2 } from 'lucide-react';

import { uploadImages } from '@/api/uploadAPI';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

// * Define the props for communication with the parent form
interface ImageUploaderProps {
  onUploadComplete: (urls: string[]) => void;
}

export const ImageUploader = ({ onUploadComplete }: ImageUploaderProps) => {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setIsUploading(true);
    const uploadPromise = uploadImages(acceptedFiles);

    toast.promise(uploadPromise, {
      loading: 'Uploading images...',
      success: (data) => {
        const newUrls = [...uploadedUrls, ...data.urls];
        setUploadedUrls(newUrls);
        onUploadComplete(newUrls); // =-= Communicate the full list of URLs to the parent
        setIsUploading(false);
        return `${acceptedFiles.length} image(s) uploaded successfully!`;
      },
      error: (_error) => {
        setIsUploading(false);
        console.log(_error);
        return 'Upload failed. Please try again.';
      },
    });
  }, [uploadedUrls, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 5,
    disabled: isUploading, // ? Disable dropzone while an upload is in progress
  });

  const removeImage = (urlToRemove: string) => {
    const newUrls = uploadedUrls.filter(url => url !== urlToRemove);
    setUploadedUrls(newUrls);
    onUploadComplete(newUrls); // =-= Update the parent form
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pet Images</CardTitle>
        <CardDescription>Upload at least one main image and up to four others.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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

        {uploadedUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
            {uploadedUrls.map((url, index) => (
              <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                <img src={`http://localhost:3000${url}`} alt={`Preview ${index}`} className="h-full w-full object-cover" />
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
      </CardContent>
    </Card>
  );
};