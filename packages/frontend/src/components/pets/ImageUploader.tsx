// src/components/pets/ImageUploader.tsx

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';


// Define the shape of the file object with a preview URL
interface FileWithPreview extends File 
{
  preview: string;
}

export const ImageUploader = () => 
{
  // We will manage the uploaded files in this component's state
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Add a 'preview' URL to each file so we can display it
    const filesWithPreview = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    setFiles(prevFiles => [...prevFiles, ...filesWithPreview]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] }, // Accept all image types
    maxFiles: 5,
  });

  const removeFile = (fileName: string) => {
    setFiles(files.filter(file => file.name !== fileName));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pet Images</CardTitle>
        <CardDescription>Upload at least one main image and up to four others.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Dropzone */}
        <div 
          {...getRootProps()} 
          className={`
            flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed 
            p-8 text-center transition-colors 
            ${isDragActive ? 'border-indigo-600 bg-indigo-50' : 'border-neutral-300 hover:border-neutral-400'}
          `}
        >
          <input {...getInputProps()} />
          <UploadCloud className="h-12 w-12 text-neutral-400" />
          <p className="mt-4 font-semibold">
            {isDragActive ? 'Drop the files here...' : 'Drag & drop files here, or click to browse'}
          </p>
          <p className="text-xs text-neutral-500">PNG, JPG, WEBP up to 10MB</p>
        </div>

        {/* Image Previews */}
        {files.length > 0 && (
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
            {files.map((file, index) => (
              <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                <img src={file.preview} alt={`Preview ${index}`} className="h-full w-full object-cover" />
                <button 
                  onClick={() => removeFile(file.name)}
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