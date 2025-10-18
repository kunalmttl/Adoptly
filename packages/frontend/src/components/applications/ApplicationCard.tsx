// src/components/applications/ApplicationCard.tsx

import type { Application } from '@/api/applicationAPI';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

// Define a reusable type for the badge variants for better type safety.
type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

/**
 * Props for the ApplicationCard component.
 */
interface ApplicationCardProps {
  /** The application object containing pet details. */
  application: Application;
}

/**
 * A card component that displays a summary of a single adoption application
 * from the perspective of the person who applied.
 */
export const ApplicationCard = ({ application }: ApplicationCardProps) => {
  /**
   * Determines the visual style of the status badge based on the application status.
   * @param status - The current status ('pending', 'approved', 'rejected').
   * @returns The corresponding variant name for the Badge component.
   */
  const getStatusBadgeVariant = (status: string): BadgeVariant => {
    switch (status) {
      case 'approved':
        return 'default'; // Greenish theme color
      case 'rejected':
        return 'destructive'; // Red theme color
      case 'pending':
      default:
        return 'secondary'; // Grey theme color
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="flex items-center gap-4 p-4">
        {/* Pet Avatar */}
        <Avatar className="h-20 w-20 rounded-lg">
          <AvatarImage
            src={application.pet.images[0] || '/placeholder-pet.jpg'}
            alt={application.pet.name}
            className="object-cover"
          />
          <AvatarFallback>{application.pet.name.charAt(0)}</AvatarFallback>
        </Avatar>

        {/* Application Details */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Pet Info Section */}
          <div>
            <h3 className="font-bold text-lg">{application.pet.name}</h3>
            <p className="text-sm text-neutral-500">Listed by: {application.pet.listed_by.name}</p>
          </div>

          {/* Date Section */}
          <div>
            <p className="text-sm text-neutral-500">Applied on:</p>
            {/* Format the ISO date string into a more readable local date format. */}
            <p className="font-medium">{new Date(application.createdAt).toLocaleDateString()}</p>
          </div>

          {/* Status Badge Section */}
          <div className="flex justify-start md:justify-end">
            <Badge variant={getStatusBadgeVariant(application.status)} className="capitalize text-sm px-3 py-1">
              {application.status}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};