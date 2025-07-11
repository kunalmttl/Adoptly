// src/pages/PetDetailsPage.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPetById } from '@/api/petAPI';

import { PetImageGallery } from '@/components/pets/PetImageGallery';
import { PetInfo } from '@/components/pets/PetInfo';
import { PetActions } from '@/components/pets/PetActions';
import { Loader2 } from 'lucide-react';

// Define the full Pet type
interface FullPet 
{
  _id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: string;
  description: string;
  status: string;
  vaccinated: boolean;
  images: string[];
  listed_by: { _id: string; name: string; }; // Assume populated owner info
}

const PetDetailsPage = () => 
{
  const { id } = useParams<{ id: string }>();
  const [pet, setPet] = useState<FullPet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => 
  {
    if (!id) return;
    const fetchPet = async () => 
    {
      try 
      {
        const petData = await getPetById(id);
        setPet(petData);
      } 
      catch (error) 
      {
        console.error("Failed to fetch pet details", error);
      } 
      finally 
      {
        setIsLoading(false);
      }
    };
    fetchPet();
  }, [id]);

  if (isLoading) 
  {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!pet) 
  {
    return <div className="flex h-screen items-center justify-center"><p>Pet not found.</p></div>;
  }

  return (
    <div className="bg-orange-50 min-h-screen">
      <div className="container mx-auto px-4 py-12 pt-32">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
          <PetImageGallery images={pet.images} petName={pet.name} />
          <div>
            <PetInfo pet={{...pet, isVaccinated: pet.vaccinated}} />
            <PetActions petOwnerId={pet.listed_by._id} petId={pet._id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetailsPage;