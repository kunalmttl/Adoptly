
// --- Main Page Component ---
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
  const petsPerPage = 9; // User requested 9 cards per page

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
    async (currentFilters: IPetFilters) => {
      setIsLoading(true);
      setError(null);
      try {
        const activeFilters: IPetFilters = {};
        Object.entries(currentFilters).forEach(([key, value]) => {
          if (value && value !== "all") {
            activeFilters[key as keyof IPetFilters] = value;
          }
        });
        const response = await getAllPets({ ...activeFilters, page: currentPage, limit: petsPerPage });
        setPets(response.pets);
        setTotalPages(response.pages);
      } catch (err) {
        console.error("Failed to fetch pets:", err);
        setError("Could not load pets. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, petsPerPage] // Add currentPage and petsPerPage to dependencies
  );

  useEffect(() => {
    fetchPets(filters);
  }, [filters, fetchPets]);

  const handleFilterChange = useCallback((key: keyof IPetFilters, value: string | boolean) => {
    setCurrentPage(1); // Reset to first page on filter change
    setFilters(prev => ({ ...prev, [key]: value }));
  }, [setFilters, setCurrentPage]);

  const handleSearchChange = useCallback(
    (searchBy: "name" | "breed", query: string) => {
      setCurrentPage(1); // Reset to first page on search change
      setFilters((prev) => ({
        ...prev,
        search_by: searchBy,
        search_query: query,
      }));
    },
    [setFilters, setCurrentPage] // Add setFilters and setCurrentPage to dependencies
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
  const renderContent = (currentPage: number, totalPages: number) => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: petsPerPage }).map((_, index) => (
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
      <div className="container mx-auto pt-12 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters always on the left */}
          <aside className="w-full md:w-1/4 lg:w-1/5 md:sticky md:top-24 h-[calc(100vh-6rem)] overflow-y-auto">
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
            {renderContent(currentPage, totalPages)}

            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationPrevious onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} />
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNumber)}
                          isActive={pageNumber === currentPage}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationNext onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} />
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