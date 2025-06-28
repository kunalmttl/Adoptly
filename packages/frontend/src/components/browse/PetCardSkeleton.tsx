// src/components/browse/PetCardSkeleton.tsx

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const PetCardSkeleton = () => 
{
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <AspectRatio ratio={1 / 1}>
          {/* Image Skeleton */}
          <Skeleton className="h-full w-full" />
        </AspectRatio>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        {/* Title Skeleton */}
        <Skeleton className="h-5 w-3/4" />
        {/* Subtitle Skeleton */}
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {/* Tags Skeleton */}
        <Skeleton className="h-6 w-1/3" />
      </CardFooter>
    </Card>
  );
};