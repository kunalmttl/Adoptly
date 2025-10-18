// src/pages/MyListingsPage.tsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Loader2 } from 'lucide-react';

import { useAuthStore } from '@/store/authStore';
import { getMyListedPets, type Pet } from '@/api/petAPI';
import PetCard from '@/components/browse/PetCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

/**
 * A page that displays all the pets listed by the currently authenticated "Seller".
 */
const MyListingsPage = () => {
  const { user } = useAuthStore();
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Effect to fetch the user's pet listings.
  useEffect(() => {
    // Only fetch if the user is logged in and has a 'seller' profile.
    if (user?.profile_type === 'seller') {
      const fetchMyPets = async () => {
        try {
          const myPets = await getMyListedPets();
          setPets(myPets);
        } catch (err) {
          setError('Failed to load your listings. Please try again later.');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchMyPets();
    } else {
      // If the user is not a seller, stop loading and let the guard clause handle the UI.
      setIsLoading(false);
    }
  }, [user]);

  // --- Guard Clause for non-sellers ---
  if (user && user.profile_type !== 'seller') {
    return (
      <div className="container mx-auto flex h-[calc(100vh-6rem)] items-center justify-center pt-24">
        <Alert variant="destructive" className="max-w-md"><AlertTriangle className="h-4 w-4" /><AlertTitle>Access Denied</AlertTitle><AlertDescription>This page is only for users with a "Seller" profile.</AlertDescription></Alert>
      </div>
    );
  }

  // --- Render Logic ---
  if (isLoading) {
    return <div className="container mx-auto flex h-[calc(100vh-6rem)] items-center justify-center pt-24"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (error) {
    return (
      <div className="container mx-auto flex h-[calc(100vh-6rem)] items-center justify-center pt-24">
        <Alert variant="destructive" className="max-w-md"><AlertTriangle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 pt-32 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Pet Listings</h1>
        <p className="text-neutral-500">Manage all the pets you have listed for adoption.</p>
      </div>

      {pets.length > 0 ? (
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" initial="hidden" animate="visible" transition={{ staggerChildren: 0.1 }}>
          {pets.map((pet) => <PetCard key={pet._id} pet={pet} />)}
        </motion.div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-semibold">No pets listed yet.</h3>
          <p className="text-neutral-500 mt-2">Ready to find a new home for a pet?</p>
          <Link to="/sell"><Button className="mt-4">List Your First Pet</Button></Link>
        </div>
      )}
    </div>
  );
};

export default MyListingsPage;