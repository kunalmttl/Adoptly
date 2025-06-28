// frontend/src/pages/BrowsePetsPage.tsx

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

// --- Local Imports & Type Definitions ---
import { getAllPets, type Pet, type PetFilters as IPetFilters } from "@/api/petAPI"; // <-- Import new Pet type
import PetCard from "@/components/browse/PetCard";
import { PetCardSkeleton } from "@/components/browse/PetCardSkeleton";

// --- Shadcn UI & Icon Imports ---
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { PetFilters } from "@/components/browse/PetFilters";

// --- Main Page Component ---
const BrowsePetsPage = () => {
  // #####################################################################
  // #                           State Management                        #
  // #####################################################################
  
  const [pets, setPets] = useState<Pet[]>([]); // <-- Use imported Pet type
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<IPetFilters>({
    species: 'all',
    breed: '',
    vaccinated: false,
    status: 'all',
  });

  // #####################################################################
  // #                            Data Fetching                          #
  // #####################################################################

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
        staggerChildren: 0.08,
      },
    },
  };

  // #####################################################################
  // #                           Render Logic                            #
  // #####################################################################
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <PetCardSkeleton key={index} />
          ))}
        </div>
      );
    }

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
    
    if (pets.length === 0) {
        return (
            <div className="text-center py-16 col-span-full">
                <h3 className="text-xl font-semibold">No pets found.</h3>
                <p className="text-neutral-500 mt-2">Try adjusting your filters or check back later!</p>
            </div>
        )
    }

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
            age={pet.age ?? 0} // Provide a fallback for age
            isVaccinated={pet.health_status?.vaccinated ?? false} // <-- Safely access nested property
            status={pet.status}
            imageUrl={pet.images[0] || '/placeholder-pet.jpg'}
            location={pet.location} // <-- Pass the whole location object
          />
        ))}
      </motion.div>
    );
  };
  
  return (
      <div className="grid grid-cols-1 gap-8 py-8 lg:grid-cols-[280px_1fr]">
      <aside className="lg:sticky lg:top-28 h-fit">
        <PetFilters setFilters={setFilters} />
      </aside>
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