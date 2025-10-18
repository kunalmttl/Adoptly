
// frontend/src/pages/BrowsePetsPage.tsx

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

// --- Local Imports & Type Definitions ---
import {
  getAllPets,
  type Pet,
  type PetFilters as IPetFilters,
} from "@/api/petAPI";
import PetCard from "@/components/browse/PetCard";
import { PetCardSkeleton } from "@/components/browse/PetCardSkeleton";

// --- Shadcn UI & Icon Imports ---
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { PetFilters } from "@/components/browse/PetFilters";
import { PetSearch } from "@/components/layout/PetSearch";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";




// --- Main Page Component ---
const BrowsePetsPage = () => {
  // #####################################################################
  // #                           State Management                        #
  // #####################################################################
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  const [filters, setFilters] = useState<IPetFilters>({
    species: "all",
    breed: "",
    vaccinated: false,
    status: "all",
  });

  // #####################################################################
  // #                            Data Fetching                          #
  // #####################################################################
  const fetchPets = useCallback(
    async (currentFilters: IPetFilters, page:number) => {
      setIsLoading(true);
      setError(null);
      try {
        const activeFilters: IPetFilters = {};
        Object.entries(currentFilters).forEach(([key, value]) => {
          if (value && value !== "all") {
            activeFilters[key as keyof IPetFilters] = value;
          }
        });
        const petsData = await getAllPets(activeFilters, page);
        setPets(petsData.data);
        setTotalPages(petsData.pagination.totalPages);

      } catch (err) {
        console.error("Failed to fetch pets:", err);
        setError("Could not load pets. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchPets(filters, currentPage);
  }, [filters, currentPage, fetchPets]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to top on page change
  };


  const handleSearchChange = useCallback(
    (searchBy: "name" | "breed", query: string) => {
      setFilters((prev) => ({
        ...prev,
        search_by: searchBy,
        search_query: query,
      }));
    },
    []
  );

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
          <p className="text-neutral-500 mt-2">
            Try adjusting your filters or check back later!
          </p>
        </div>
      );
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
            age={pet.age ?? 0}
            isVaccinated={pet.health_status?.vaccinated ?? false}
            status={pet.status}
            imageUrl={pet.images[0] || "/placeholder-pet.jpg"}
            location={pet.location}
          />
        ))}
      </motion.div>
    );
  };

  return (
    <div className="bg-orange-50 min-h-screen">
      <div className="container mx-auto pt-24 pb-12 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters always on the left */}
          <aside className="w-full md:w-1/4 lg:w-1/5 md:sticky md:top-24 h-fit">
            <PetFilters setFilters={setFilters} />
          </aside>

          {/* Everything else on the right */}
          <main className="w-full md:w-3/4 lg:w-4/5 space-y-8">
            {/* Page Header and Search Bar */}
            <div className="space-y-4">
              <h1 className="text-4xl font-poppins font-bold text-neutral-800">
                Find Your Companion
              </h1>
              <p className="font-montserrat text-neutral-600 max-w-2xl">
                Browse pets from sellers across the country. Use the search and
                filters to find the perfect match for your family.
              </p>
              <div className="max-w-2xl">
                <PetSearch onSearchChange={handleSearchChange} />
              </div>
            </div>

            {/* Pet Grid */}
            {renderContent()}

            {!isLoading && !error && totalPages > 1 && (
              <div className="mt-12 items-center justify-around">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        size="default"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(currentPage - 1);
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>

                    {/* We can create more complex logic for page numbers later */}
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          size="default"
                          href="#"
                          isActive={currentPage === index + 1}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(index + 1);
                          }}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        size="default"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(currentPage + 1);
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default BrowsePetsPage;
