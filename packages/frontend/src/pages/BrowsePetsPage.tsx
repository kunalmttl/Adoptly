// src/pages/BrowsePetsPage.tsx

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import PetCard from "@/components/browse/PetCard";
import { PetCardSkeleton } from "@/components/browse/PetCardSkeleton";
import { getAllPets } from "@/api/petAPI";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";


// Define the shape of a single pet object we expect from the API
// This should match the structure of your Pet model on the backend
interface Pet 
{
  _id: string; // MongoDB uses _id
  name: string;
  age: number;
  vaccinated: boolean;
  status: 'available' | 'pending' | 'adopted';
  images: string[];
  breed: string;
  location: { city: string; country: string; };
}

const BrowsePetsPage = () => 
{
  // State for storing pets, loading status, and errors
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect hook to fetch data when the component mounts
  useEffect(() => 
  {
    const fetchPets = async () => {
      try {
        setIsLoading(true); // Start loading
        const petsData = await getAllPets();
        setPets(petsData);
      } catch (err) {
        console.error("Failed to fetch pets:", err);
        setError("Could not load pets. Please try again later.");
      } finally {
        setIsLoading(false); // Stop loading, regardless of success or error
      }
    };

    fetchPets();
  }, []); // The empty array ensures this runs only once

  const containerVariants = 
  {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };
  
  // --- Conditional Rendering Logic ---

  // 1. Show skeletons while loading
  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Available Pets</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Render 6 skeleton cards as placeholders */}
          {Array.from({ length: 6 }).map((_, index) => (
            <PetCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  // 2. Show an error message if fetching failed
  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // 3. Show the actual data once loaded
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl ml-5 font-bold">Available Pets</h1>
      </div>

      <motion.div 
        className="grid grid-cols-1 ml-5 md:grid-cols-2 lg:grid-cols-3 gap-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {pets.map((pet) => (
          <PetCard 
            key={pet._id} 
            id={pet._id}
            name={pet.name}
            age={pet.age}
            isVaccinated={pet.vaccinated}
            status={pet.status}
            imageUrl={pet.images[0] || '/placeholder-pet.jpg'} // Use first image or a placeholder
            location={pet.location}
          />
        ))}
      </motion.div>
    </div>
  );
}

export default BrowsePetsPage;