// src/pages/BrowsePetsPage.tsx

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

import { getAllPets, type Pet, type PetFilters as IPetFilters } from '@/api/petAPI';
import PetCard from '@/components/browse/PetCard';
import { PetCardSkeleton } from '@/components/browse/PetCardSkeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PetFilters } from '@/components/browse/PetFilters';
import { PetSearch } from '@/components/layout/PetSearch';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

// Animation variants for the pet grid container to stagger the cards' appearance.
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

/**
 * The main page for browsing, searching, and filtering pet listings.
 */
const BrowsePetsPage = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<IPetFilters>({});

  /**
   * Fetches pets from the API based on the current filters and page number.
   * Wrapped in useCallback for performance optimization.
   */
  const fetchPets = useCallback(async (currentFilters: IPetFilters, page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      // Clean the filters object to only send active filters to the API.
      const activeFilters: IPetFilters = {};
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          activeFilters[key as keyof IPetFilters] = value;
        }
      });
      const response = await getAllPets(activeFilters, page);
      setPets(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      console.error('Failed to fetch pets:', err);
      setError('Could not load pets. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect to re-fetch pets whenever filters or the current page change.
  useEffect(() => {
    fetchPets(filters, currentPage);
  }, [filters, currentPage, fetchPets]);

  /**
   * Handles changing the current page for pagination.
   */
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0); // Scroll to top on page change.
    }
  };

  /**
   * Callback to update filters from the PetSearch component.
   */
  const handleSearchChange = useCallback((searchBy: 'name' | 'breed', query: string) => {
    setFilters((prev) => ({ ...prev, search_by: searchBy, search_query: query }));
    setCurrentPage(1); // Reset to first page on new search.
  }, []);

  /**
   * Renders the main content area: loading skeletons, error message, empty state, or the pet grid.
   */
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 9 }).map((_, index) => <PetCardSkeleton key={index} />)}
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex h-full items-center justify-center pt-20">
          <Alert variant="destructive" className="max-w-md"><AlertTriangle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>
        </div>
      );
    }
    if (pets.length === 0) {
      return (
        <div className="text-center py-16 col-span-full">
          <h3 className="text-xl font-semibold">No pets found.</h3>
          <p className="text-neutral-500 mt-2">Try adjusting your filters or check back later!</p>
        </div>
      );
    }
    return (
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" variants={containerVariants} initial="hidden" animate="visible">
        {pets.map((pet) => <PetCard key={pet._id} pet={pet} />)}
      </motion.div>
    );
  };

  return (
    <div className="bg-orange-50 min-h-screen">
      <div className="container mx-auto pt-24 pb-12 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* --- Filters Sidebar --- */}
          <aside className="w-full md:w-1/4 lg:w-1/5 md:sticky md:top-24 h-fit">
            <PetFilters setFilters={setFilters} />
          </aside>

          {/* --- Main Content Area --- */}
          <main className="w-full md:w-3/4 lg:w-4/5 space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-neutral-800">Find Your Companion</h1>
              <p className="text-neutral-600 max-w-2xl">Browse pets from sellers across the country. Use the search and filters to find the perfect match for your family.</p>
              <div className="max-w-2xl"><PetSearch onSearchChange={handleSearchChange} /></div>
            </div>
            {renderContent()}
            {!isLoading && !error && totalPages > 1 && (
              <div className="mt-12">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem><PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }} className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''} /></PaginationItem>
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <PaginationItem key={index}><PaginationLink href="#" isActive={currentPage === index + 1} onClick={(e) => { e.preventDefault(); handlePageChange(index + 1); }}>{index + 1}</PaginationLink></PaginationItem>
                    ))}
                    <PaginationItem><PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }} className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''} /></PaginationItem>
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