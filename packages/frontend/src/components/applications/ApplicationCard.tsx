// # Application Card Component

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ApplicationWithPet } from "@/api/applicationAPI";

interface ApplicationCardProps 
{
  application: ApplicationWithPet;
}

export const ApplicationCard = ({ application }: ApplicationCardProps) => {
  
  // * Helper to get badge color based on status
  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'approved':
        return 'default'; // Uses primary color (greenish by default)
      case 'rejected':
        return 'destructive'; // Red
      case 'pending':
      default:
        return 'secondary'; // Grey
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="flex items-center gap-4 p-4">
        <Avatar className="h-20 w-20 rounded-lg">
          <AvatarImage 
            src={application.pet.images[0] || '/placeholder-pet.jpg'} 
            alt={application.pet.name} 
            className="object-cover"
          />
          <AvatarFallback>{application.pet.name.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Pet Info */}
          <div>
            <h3 className="font-bold text-lg">{application.pet.name}</h3>
            <p className="text-sm text-neutral-500">Listed by: {application.pet.listed_by.name}</p>
          </div>
          
          {/* Application Date */}
          <div>
            <p className="text-sm text-neutral-500">Applied on:</p>
            <p className="font-medium">{new Date(application.createdAt).toLocaleDateString()}</p>
          </div>

          {/* Status Badge */}
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