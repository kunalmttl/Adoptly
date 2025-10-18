// src/pages/EditPetPage.tsx

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, AlertTriangle } from 'lucide-react';

import { getPetById, type Pet } from '@/api/petAPI';
import { useAuthStore } from '@/store/authStore';
import { EditPetForm } from '@/components/pets/EditPetForm';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

/**
 * The page for editing an existing pet listing.
 * It fetches the pet's data and performs an authorization check to ensure
 * only the owner can access the edit form.
 */
const EditPetPage = () => {
  const { id: petId } = useParams<{ id: string }>();
  const { user } = useAuthStore();

  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Effect to fetch pet data and verify ownership.
  useEffect(() => {
    if (!petId) {
      setError('Pet ID is missing from the URL.');
      setIsLoading(false);
      return;
    }

    const fetchPet = async () => {
      try {
        const petData = await getPetById(petId);
        // Security check: Ensure the logged-in user is the one who listed the pet.
        if (petData.listed_by._id !== user?.id) {
          setError('You are not authorized to edit this listing.');
        } else {
          setPet(petData);
        }
      } catch (err) {
        setError('Failed to load pet details. Please try again later.');
        console.error('Failed to load pet details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPet();
  }, [petId, user?.id]);

  // --- Render Logic ---
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (error) {
    return (
      <div className="container flex h-[calc(100vh-6rem)] items-center justify-center pt-24">
        <Alert variant="destructive" className="max-w-md"><AlertTriangle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error} <Link to="/my-listings" className="font-bold underline">Go back to your listings.</Link></AlertDescription></Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 pt-32">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Listing for {pet?.name}</h1>
        <p className="text-neutral-500">Update the details for your pet.</p>
      </div>
      {/* Render the form only after the pet data has been successfully loaded. */}
      {pet && <EditPetForm pet={pet} />}
    </div>
  );
};

export default EditPetPage;