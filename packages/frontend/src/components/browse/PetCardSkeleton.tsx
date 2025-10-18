// src/components/browse/PetCardSkeleton.tsx

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * A skeleton loading component that mimics the layout of a PetCard.
 * It is displayed to the user while the actual pet data is being fetched from the API,
 * providing a better user experience by indicating that content is loading.
 */
export const PetCardSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <AspectRatio ratio={1 / 1}>
          {/* Skeleton for the pet image */}
          <Skeleton className="h-full w-full" />
        </AspectRatio>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        {/* Skeleton for the pet's name */}
        <Skeleton className="h-5 w-3/4" />
        {/* Skeleton for the pet's age/location */}
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {/* Skeleton for the status tags */}
        <Skeleton className="h-6 w-1/3" />
      </CardFooter>
    </Card>
  );
};