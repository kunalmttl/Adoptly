// src/pages/BrowsePetsPage.tsx

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

// --- Local Imports & Type Definitions ---
import { getAllPets, type PetFilters as IPetFilters } from "@/api/petAPI";
import PetCard from "@/components/browse/PetCard";
import { PetCardSkeleton } from "@/components/browse/PetCardSkeleton";

// --- Shadcn UI & Icon Imports ---
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { PetFilters } from "@/components/browse/PetFilters";


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

// --- Main Page Component ---
const BrowsePetsPage = () => {
  // #####################################################################
  // #                           State Management                        #
  // #####################################################################
  
  
  // State for the fetched pet data
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for the filter criteria, passed down to the filters component
  const [filters, setFilters] = useState<IPetFilters>({
    species: 'all',
    breed: '',
    vaccinated: false, // Add new filter defaults
    status: 'all',     // Add new filter defaults
  });


  // #####################################################################
  // #                            Data Fetching                          #
  // #####################################################################

  // We use useCallback to memoize the fetch function, preventing unnecessary re-creation
  const fetchPets = useCallback(async (currentFilters: IPetFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const activeFilters: IPetFilters = {};
      if (currentFilters.species && currentFilters.species !== 'all') {
        activeFilters.species = currentFilters.species;
      }
      if (currentFilters.breed) {
        activeFilters.breed = currentFilters.breed;
      }
      if (currentFilters.vaccinated) {
        activeFilters.vaccinated = currentFilters.vaccinated;
      }
      if (currentFilters.status && currentFilters.status !== 'all') {
        activeFilters.status = currentFilters.status;
      }

      const petsData = await getAllPets(activeFilters);
      setPets(petsData);
    } catch (err) {
      console.error("Failed to fetch pets:", err);
      setError("Could not load pets. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // This useEffect hook listens for any changes to the 'filters' object.
  // When a filter changes, it triggers a new API call.
  useEffect(() => {
    fetchPets(filters);
  }, [filters, fetchPets]);

  // #####################################################################
  // #                         Animation Variants                        #
  // #####################################################################
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, // Creates a nice cascading effect for the cards
      },
    },
  };

  // #####################################################################
  // #                           Render Logic                            #
  // #####################################################################
  
  // A helper function to render the main content based on the current state
  const renderContent = () => {
    // 1. Show skeletons while loading
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <PetCardSkeleton key={index} />
          ))}
        </div>
      );
    }

    // 2. Show an error message if fetching failed
    if (error) {
      return (
        <div className="flex h-full items-center justify-center pt-20">
          <Alert variant="destructive" className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      );
    }
    
    // 3. Show "No pets found" message if the array is empty
    if (pets.length === 0) {
        return (
            <div className="text-center py-16 col-span-full">
                <h3 className="text-xl font-semibold">No pets found.</h3>
                <p className="text-neutral-500 mt-2">Try adjusting your filters or check back later!</p>
            </div>
        )
    }

    // 4. Show the actual pet cards once data is loaded
    return (
      <motion.div
        className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
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
            // --- FIX #2: Access the nested property ---
            isVaccinated={pet.vaccinated} 
            status={pet.status}
            imageUrl={pet.images[0] || '/placeholder-pet.jpg'}
            location={pet.location}
          />
        ))}
      </motion.div>

    );
  };
  
  // Note: The AppLayout and PetFilters are now rendered directly by the page
  // This makes the page a self-contained unit.
  return (
      <div className="grid grid-cols-1 gap-8 py-8 lg:grid-cols-[280px_1fr]">
      
      {/* Left Column: Filters */}
      <aside className="lg:sticky lg:top-28 h-fit">
        <PetFilters setFilters={setFilters} />
      </aside>

      {/* Right Column: Pet Grid */}
      <main>
        <div className="mb-8">
            <h1 className="text-3xl font-bold">Find Your Companion</h1>
            <p className="text-neutral-500 mt-1">Browse pets available for adoption.</p>
        </div>
        {renderContent()}
      </main>

    </div>
  );
};


export default BrowsePetsPage;