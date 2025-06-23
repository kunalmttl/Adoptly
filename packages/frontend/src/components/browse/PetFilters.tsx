// src/components/browse/PetFilters.tsx

import { useEffect, useState } from "react";
import { type PetFilters as IPetFilters } from "@/api/petAPI";
import { useDebounce } from "@/hooks/useDebounce";
import FilterGroup from "./FilterGroup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

// --- Main Component ---
interface PetFiltersProps {
  setFilters: React.Dispatch<React.SetStateAction<IPetFilters>>;
}

export const PetFilters = ({ setFilters }: PetFiltersProps) => {
  // --- Local State for Debounced Input ---
  const [breedInput, setBreedInput] = useState('');
  const debouncedBreed = useDebounce(breedInput, 500);

  useEffect(() => {
    setFilters(prev => ({ ...prev, breed: debouncedBreed }));
  }, [debouncedBreed, setFilters]);

  // --- Event Handlers ---
  const handleFilterChange = (key: keyof IPetFilters, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  return (
    <aside className="h-full bg-neutral-100 p-6 text-neutral-800 rounded-lg">
      <h3 className="mb-6 text-2xl font-bold">Filters</h3>

      <FilterGroup title="Species">
        <RadioGroup
          defaultValue="all"
          onValueChange={(value) => handleFilterChange('species', value)}
          className="space-y-2"
        >
          {['All', 'Dog', 'Cat', 'Rabbit', 'Bird', 'Other'].map((s) => (
            <div key={s} className="flex items-center space-x-2">
              <RadioGroupItem value={s.toLowerCase()} id={`s-${s}`} />
              <Label htmlFor={`s-${s}`} className="font-normal">{s}</Label>
            </div>
          ))}
        </RadioGroup>
      </FilterGroup>

      <FilterGroup title="Breed">
        <Input
          placeholder="e.g., Golden Retriever"
          className="bg-white"
          value={breedInput}
          onChange={(e) => setBreedInput(e.target.value)}
        />
      </FilterGroup>

      {/* --- NEW VACCINATION FILTER --- */}
      <FilterGroup title="Health Status">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="vaccinated" 
            onCheckedChange={(checked) => handleFilterChange('vaccinated', !!checked)}
          />
          <Label htmlFor="vaccinated" className="font-normal">
            Vaccinated
          </Label>
        </div>
      </FilterGroup>

      {/* --- NEW APPLICATION STATUS FILTER --- */}
      <FilterGroup title="Application Status">
        <RadioGroup
          defaultValue="all"
          onValueChange={(value) => handleFilterChange('status', value)}
          className="space-y-2"
        >
          {['All', 'Available', 'Pending'].map((s) => (
            <div key={s} className="flex items-center space-x-2">
              <RadioGroupItem value={s.toLowerCase()} id={`status-${s}`} />
              <Label htmlFor={`status-${s}`} className="font-normal">{s}</Label>
            </div>
          ))}
        </RadioGroup>
      </FilterGroup>
    </aside>
  );
};