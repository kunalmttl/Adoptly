// src/pages/PetDetailsPage.tsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import { getPetById, type Pet } from '@/api/petAPI';
import { PetImageGallery } from '@/components/pets/PetImageGallery';
import { PetInfo } from '@/components/pets/PetInfo';
import { PetActions } from '@/components/pets/PetActions';

/**
 * The page for displaying the detailed information of a single pet.
 */
const PetDetailsPage = () => {
  const { id: petId } = useParams<{ id: string }>();
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Effect to fetch the pet's details when the component mounts or the ID changes.
  useEffect(() => {
    if (!petId) return;
    const fetchPet = async () => {
      try {
        const petData = await getPetById(petId);
        setPet(petData);
      } catch (error) {
        console.error('Failed to fetch pet details', error);
        // Optionally set an error state here to show a message to the user.
      } finally {
        setIsLoading(false);
      }
    };
    fetchPet();
  }, [petId]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!pet) {
    return <div className="flex h-screen items-center justify-center"><p>Pet not found.</p></div>;
  }

  return (
    <div className="bg-orange-50 min-h-screen">
      <div className="container mx-auto px-4 py-12 pt-32">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Left Column: Image Gallery */}
          <PetImageGallery images={pet.images} petName={pet.name} />
          {/* Right Column: Pet Info and Actions */}
          <div>
            <PetInfo pet={pet} />
            <PetActions owner={pet.listed_by} petId={pet._id} petName={pet.name} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetailsPage;