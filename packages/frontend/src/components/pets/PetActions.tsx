// # Pet Actions Component
// * Displays action buttons for a pet based on user ownership.

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';

interface PetActionsProps {
  petOwnerId: string;
  petId: string;
}

const PetActions = ({ petOwnerId, petId }: PetActionsProps) => {
  const { user } = useAuthStore();

  // * Check if the current user is the pet owner
  if (user?.id === petOwnerId) {
    return (
      <div className="flex gap-4">
        <Link to={`/edit-pet/${petId}`}>
          <Button>Edit Listing</Button>
        </Link>
      </div>
    );
  }

  // * Show apply button for non-owners
  return (
    <div className="flex gap-4">
      <Link to={`/apply-for-adoption/${petId}`}>
        <Button>Apply for Adoption</Button>
      </Link>
    </div>
  );
};

export default PetActions;