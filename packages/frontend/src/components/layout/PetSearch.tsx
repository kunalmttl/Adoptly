// # Pet Search Component (Controlled)

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

// * Define the props it will receive from the parent page
interface PetSearchProps {
  onSearchChange: (searchBy: 'name' | 'breed', query: string) => void;
}

export const PetSearch = ({ onSearchChange }: PetSearchProps) => {
  const [query, setQuery] = useState('');
  const [searchBy, setSearchBy] = useState<'name' | 'breed'>('breed');
  
  // =-= Debounce the search query to avoid excessive API calls while typing
  const debouncedQuery = useDebounce(query, 500);

  // * When the debounced query or the search type changes, call the parent's function
  useEffect(() => {
    onSearchChange(searchBy, debouncedQuery);
  }, [debouncedQuery, searchBy, onSearchChange]);

  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
      <Input
        className="pl-12 pr-36 h-14 text-base rounded-full bg-white border-neutral-200 focus:border-beige focus:ring-beige"
        placeholder="Search by pet name or breed..."
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2">
        <Select value={searchBy} onValueChange={(value: 'name' | 'breed') => setSearchBy(value)}>
          <SelectTrigger className="w-[120px] bg-neutral-100 font-montserrat rounded-full border-none focus:ring-0">
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