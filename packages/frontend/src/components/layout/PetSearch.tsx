// src/components/layout/PetSearch.tsx

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

/**
 * Defines the valid search criteria options.
 */
type SearchByType = 'name' | 'breed';

/**
 * Props for the PetSearch component.
 */
interface PetSearchProps {
  /** A callback function to notify the parent component of search changes. */
  onSearchChange: (searchBy: SearchByType, query: string) => void;
}

/**
 * A controlled search input component for finding pets by name or breed.
 * It uses a debounced input to optimize performance by delaying the search
 * until the user has stopped typing.
 */
export const PetSearch = ({ onSearchChange }: PetSearchProps) => {
  const [query, setQuery] = useState('');
  const [searchBy, setSearchBy] = useState<SearchByType>('breed');

  // Debounce the search query to avoid firing the search on every keystroke.
  const debouncedQuery = useDebounce(query, 500);

  // Effect that triggers the search when the debounced query or search type changes.
  useEffect(() => {
    onSearchChange(searchBy, debouncedQuery);
  }, [debouncedQuery, searchBy, onSearchChange]);

  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
      <Input
        className="pl-12 pr-36 h-14 text-base rounded-full bg-white border-neutral-200 focus:border-orange-300 focus:ring-orange-300"
        placeholder="Search by pet name or breed..."
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2">
        <Select value={searchBy} onValueChange={(value: SearchByType) => setSearchBy(value)}>
          <SelectTrigger className="w-[120px] bg-neutral-100 rounded-full border-none focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="breed">Breed</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};