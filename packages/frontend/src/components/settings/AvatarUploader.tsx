// src/components/settings/AvatarUploader.tsx

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

interface AvatarUploaderProps 
{
  src?: string;
  fallback: string;
}

export const AvatarUploader = ({ src, fallback }: AvatarUploaderProps) => 
{
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
          <AvatarImage src={src} />
          <AvatarFallback className="text-4xl">{fallback}</AvatarFallback>
        </Avatar>
        <Button
          size="icon"
          className="absolute bottom-0 right-0 rounded-full"
          aria-label="Change avatar"
        >
          <Camera className="h-5 w-5" />
        </Button>
      </div>
      <p className="text-sm text-neutral-500">Click the camera to change your avatar.</p>
    </div>
  );
};