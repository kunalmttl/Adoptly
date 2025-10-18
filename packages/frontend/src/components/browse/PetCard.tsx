// src/components/browse/PetCard.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import type { Pet } from '@/api/petAPI';
import { useAuthStore } from '@/store/authStore';
import { AspectRatio } from '../ui/aspect-ratio';
import { Badge } from '../ui/badge';
import { Heart, ShieldCheck } from 'lucide-react';

/**
 * Props for the PetCard component.
 * It uses a single 'pet' object for cleaner data passing.
 */
interface PetCardProps {
  /** The full pet object containing all necessary details. */
  pet: Pet;
}

/**
 * A card component to display a preview of a pet in a grid layout.
 * It is animated and handles navigation to the pet's detail page,
 * enforcing an authentication check before navigating.
 */
const PetCard = ({ pet }: PetCardProps) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Animation variants for Framer Motion to fade in the card on load.
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  /**
   * Handles the click event on the card.
   * If the user is logged in, it navigates to the pet's detail page.
   * Otherwise, it shows an error toast and redirects to the login page.
   */
  const handleCardClick = () => {
    if (user) {
      navigate(`/pets/${pet._id}`);
    } else {
      toast.error('You must be logged in to view pet details.');
      navigate('/login');
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      onClick={handleCardClick}
      className="cursor-pointer"
      aria-label={`View details for ${pet.name}`}
    >
      <div className="group overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
        {/* Image Section with a fixed 1:1 aspect ratio */}
        <div className="overflow-hidden">
          <AspectRatio ratio={1 / 1}>
            <img
              src={pet.images[0]}
              alt={pet.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </AspectRatio>
        </div>

        {/* Content Section */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-neutral-800 group-hover:text-orange-600 transition-colors">
            {pet.name}
          </h3>
          <p className="text-sm text-neutral-500">
            {pet.age} {pet.age === 1 ? 'year' : 'years'} old
          </p>
          <p className="text-sm text-neutral-500">
            {pet.location.city}, {pet.location.country}
          </p>

          {/* Status & Health Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {pet.status === 'available' && (
              <Badge variant="secondary" className="border-green-200 bg-green-100 text-green-800">
                <Heart className="mr-1 h-3 w-3 text-green-600" /> Available
              </Badge>
            )}
            {pet.status === 'pending' && (
              <Badge variant="outline" className="border-amber-300 bg-amber-100 text-amber-800">
                Pending
              </Badge>
            )}
            {pet.health_status.vaccinated && (
              <Badge variant="secondary" className="border-blue-200 bg-blue-100 text-blue-800">
                <ShieldCheck className="mr-1 h-3 w-3" /> Vaccinated
              </Badge>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Use React.memo to prevent unnecessary re-renders of the card
// if its props (the pet object) have not changed.
export default React.memo(PetCard);