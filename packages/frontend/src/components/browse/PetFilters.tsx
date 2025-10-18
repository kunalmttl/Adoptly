// src/components/browse/PetFilters.tsx

import { useEffect, useState } from 'react';
// The imported type now includes the 'vaccinated' property.
import type { PetFilters as IPetFilters } from '@/api/petAPI';
import { useDebounce } from '@/hooks/useDebounce';

import FilterGroup from './FilterGroup';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

/**
 * Props for the PetFilters component.
 */
interface PetFiltersProps {
  /** A state setter function from the parent component to update the global filters. */
  setFilters: React.Dispatch<React.SetStateAction<IPetFilters>>;
}

/**
 * A sidebar component containing various controls to filter the list of pets.
 * It uses a debounced input for the breed search to avoid excessive API calls.
 */
export const PetFilters = ({ setFilters }: PetFiltersProps) => {
  // Local state for the breed input field.
  const [breedInput, setBreedInput] = useState('');
  // Debounce the breed input to only update the filter after the user stops typing.
  const debouncedBreed = useDebounce(breedInput, 500);

  // Effect to update the parent's filter state when the debounced breed value changes.
  useEffect(() => {
    setFilters((prev) => ({ ...prev, breed: debouncedBreed }));
  }, [debouncedBreed, setFilters]);

  /**
   * A generic handler to update the filter state for radio buttons and checkboxes.
   * @param key - The filter key to update (e.g., 'species', 'vaccinated').
   * @param value - The new value for the filter.
   */
  const handleFilterChange = (key: keyof IPetFilters, value: string | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <aside className="bg-orange-50 p-6 rounded-lg">
      <h3 className="mb-6 text-2xl font-bold">Filters</h3>

      {/* Species Filter */}
      <FilterGroup title="Species">
        <RadioGroup defaultValue="all" onValueChange={(value) => handleFilterChange('species', value)} className="space-y-2">
          {['All', 'Dog', 'Cat', 'Rabbit', 'Bird', 'Other'].map((species) => (
            <div key={species} className="flex items-center space-x-2">
              <RadioGroupItem value={species.toLowerCase()} id={`species-${species}`} />
              <Label htmlFor={`species-${species}`} className="font-normal">
                {species}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </FilterGroup>

      {/* Breed Filter */}
      <FilterGroup title="Breed">
        <Input
          placeholder="e.g., Golden Retriever"
          className="bg-white"
          value={breedInput}
          onChange={(e) => setBreedInput(e.target.value)}
        />
      </FilterGroup>

      {/* Health Status Filter */}
      <FilterGroup title="Health Status">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="vaccinated"
            // This call is now type-safe because 'vaccinated' is a valid key of PetFilters.
            onCheckedChange={(checked) => handleFilterChange('vaccinated', !!checked)}
          />
          <Label htmlFor="vaccinated" className="font-normal">
            Vaccinated
          </Label>
        </div>
      </FilterGroup>

      {/* Application Status Filter */}
      <FilterGroup title="Application Status">
        <RadioGroup defaultValue="all" onValueChange={(value) => handleFilterChange('status', value)} className="space-y-2">
          {['All', 'Available', 'Pending'].map((status) => (
            <div key={status} className="flex items-center space-x-2">
              <RadioGroupItem value={status.toLowerCase()} id={`status-${status}`} />
              <Label htmlFor={`status-${status}`} className="font-normal">
                {status}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </FilterGroup>
    </aside>
  );
};