// frontend/src/pages/PetDetailsPage.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPetById, type Pet } from '@/api/petAPI'; // <-- Import new Pet type

import { PetImageGallery } from '@/components/pets/PetImageGallery';
import { PetInfo } from '@/components/pets/PetInfo';
import { PetActions } from '@/components/pets/PetActions';
import { Loader2 } from 'lucide-react';

const PetDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [pet, setPet] = useState<Pet | null>(null); // <-- Use imported Pet type
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchPet = async () => {
      try {
        const petData = await getPetById(id);
        setPet(petData);
      } catch (error) {
        console.error("Failed to fetch pet details", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPet();
  }, [id]);

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
          <PetImageGallery images={pet.images} petName={pet.name} />
          <div>
            <PetInfo pet={pet} /> {/* <-- Pass the whole pet object */}
            <PetActions owner={pet.listed_by} petId={pet._id} petName={pet.name} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetailsPage;