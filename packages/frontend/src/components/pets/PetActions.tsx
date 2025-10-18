// src/components/pets/PetActions.tsx

import { Link } from 'react-router-dom';
import { Pencil, MessageSquare, Notebook } from 'lucide-react';

import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import type { PetOwner } from '@/api/petAPI';

/**
 * Props for the PetActions component.
 */
interface PetActionsProps {
  /** The owner object of the pet. */
  owner: PetOwner;
  /** The ID of the pet. */
  petId: string;
  /** The name of the pet, used for the contact form state. */
  petName: string;
}

/**
 * A component that displays a set of action buttons on the pet detail page.
 * The actions shown are conditional based on whether the current user is the pet's owner.
 */
export const PetActions = ({ owner, petId, petName }: PetActionsProps) => {
  const { user } = useAuthStore();
  // Determine if the currently logged-in user is the owner of this pet.
  const isOwner = user?.id === owner._id;

  return (
    <div className="mt-8 pt-8 border-t">
      {isOwner ? (
        // --- View for the Pet's Owner ---
        <div className="space-y-4">
          <p className="font-semibold">This is your listing.</p>
          <Link to={`/pets/${petId}/edit`}>
            <Button size="lg" className="w-full">
              <Pencil className="mr-2 h-4 w-4" /> Edit Listing
            </Button>
          </Link>
          <Link to={`/pets/${petId}/applications`}>
            <Button size="lg" variant="outline" className="w-full mt-3">
              <Notebook className="mr-2 h-4 w-4" /> View Applications
            </Button>
          </Link>
        </div>
      ) : (
        // --- View for Potential Adopters ---
        <div className="space-y-4">
          <p className="font-semibold">Interested in adopting?</p>
          <Link to={`/apply/${petId}`}>
            <Button size="lg" className="w-full bg-orange-500 hover:bg-orange-600">
              Apply for Adoption
            </Button>
          </Link>
          {/* Pass recipient and pet name to the contact page via route state. */}
          <Link to="/contact-user" state={{ recipient: owner, petName: petName }}>
            <Button size="lg" variant="outline" className="w-full mt-3">
              <MessageSquare className="mr-2 h-4 w-4" /> Contact Seller
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};