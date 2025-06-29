// src/components/pets/PetActions.tsx
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Pencil, MessageSquare, Notebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { PetOwner } from '@/api/petAPI'; 


interface PetActionsProps 
{
  owner: PetOwner;
  petId: string;
  petName: string;
}

export const PetActions = ({ owner, petId, petName }: PetActionsProps) => 
{
  const { user } = useAuthStore();
  const isOwner = user?.id === owner._id;

  return (
    <div className="mt-8 pt-8 border-t">
      {isOwner ? (
        // View for the pet's owner
        <div className="space-y-4">
          <p className="font-semibold">This is your listing.</p>
          <Link to={`/pets/${petId}/edit`}>
            <Button size="lg" className="w-full">
              <Pencil className="mr-2 h-4 w-4" /> Edit Listing
            </Button>
          </Link>
          <Link to={`/pets/${petId}/applications`}>
            <Button size="lg" variant="outline" className="w-full">
              <Notebook className="mr-2 h-4 w-4" /> View Applications
            </Button>
          </Link>
        </div>
      ) : (
        // View for potential adopters
        <div className="space-y-4">
           <p className="font-semibold">Interested in adopting?</p>
          <Link to={`/apply/${petId}`}>
            <Button size="lg" className="w-full bg-orange-500 hover:bg-orange-600">
              Apply for Adoption
            </Button>
          </Link>
          <Link to="/contact-user" state={{ recipient: owner, petName: petName }}>
            <Button size="lg" variant="outline" className="w-full">
              <MessageSquare className="mr-2 h-4 w-4" /> Contact Seller
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};     