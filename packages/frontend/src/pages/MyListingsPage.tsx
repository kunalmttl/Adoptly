// src/pages/MyListingsPage.tsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { useAuthStore } from "@/store/authStore";
import { getMyListedPets } from "@/api/petAPI";

import PetCard from "@/components/browse/PetCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define the shape of the pet data we expect from the API
interface Pet 
{
  _id: string;
  name: string;
  age: number;
  isVaccinated: boolean;
  status: 'available' | 'pending' | 'adopted';
  images: string[];
  location: { city: string; country: string; };
}

const MyListingsPage = () => {
  const { user } = useAuthStore();
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch if the user is a seller
    if (user?.profile_type === 'seller') {
      const fetchMyPets = async () => {
        try {
          const myPets = await getMyListedPets();
          setPets(myPets);
        } catch (err) {
          setError("Failed to load your listings. Please try again later.");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchMyPets();
    }
  }, [user]); // Re-run effect if user changes

  // 1. Guard Clause for non-sellers
  if (user?.profile_type !== 'seller') {
    return (
      <div className="container mx-auto flex h-[calc(100vh-6rem)] items-center justify-center pt-24">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            This page is only for users with a "Seller" profile.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // 2. Loading State
  if (isLoading) {
    return (
      <div className="container mx-auto flex h-[calc(100vh-6rem)] items-center justify-center pt-24">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // 3. Error State
  if (error) {
    return (
      <div className="container mx-auto flex h-[calc(100vh-6rem)] items-center justify-center pt-24">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-12 pt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Pet Listings</h1>
        <p className="text-neutral-500">Manage all the pets you have listed for adoption.</p>
      </div>

      {/* 4. Display Grid or Empty State */}
      {pets.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.1 }}
        >
          {pets.map((pet) => (
            <PetCard
              key={pet._id}
              id={pet._id}
              name={pet.name}
              age={pet.age}
              location = {pet.location}
              isVaccinated={pet.isVaccinated} // Make sure your PetCard can handle this
              status={pet.status}
              imageUrl={pet.images[0] || "/placeholder-pet.jpg"} // Use first image or a placeholder
            />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-semibold">No pets listed yet.</h3>
          <p className="text-neutral-500 mt-2">Ready to find a new home for a pet?</p>
          <Link to="/sell">
            <Button className="mt-4">List Your First Pet</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyListingsPage;