// src/components/browse/PetFilters.tsx

import FilterGroup from "./FilterGroup";
import FilterCheckbox from "./FilterCheckbox";
import { Input } from "@/components/ui/input";


const PetFilters = () => 
{

  // This data will eventually come from your API or be predefined
        const speciesOptions = [
        { id: "dog", label: "Dogs", count: 12 },
        { id: "cat", label: "Cats", count: 21 },
        { id: "rabbit", label: "Rabbits", count: 5 },
        { id: "bird", label: "Birds", count: 8 },
        { id: "other", label: "Other", count: 3 },
        ];

        const statusOptions = [
        { id: "available", label: "Available", count: 38 },
        { id: "pending", label: "Pending", count: 8 },
        { id: "adopted", label: "Adopted", count: 3 },
        ];

        const detailOptions = [
        { id: "vaccinated", label: "Vaccinated" },
        { id: "special-needs", label: "Special Needs" },
        ];

        return (
        <aside className="h-full bg-neutral-900 p-6 text-white overflow-y-auto">
        <h3 className="mb-6 text-2xl font-bold">Filters</h3>

        {/* Species Filter */}
        <FilterGroup title="Species">
                <div className="space-y-3">
                {speciesOptions.map(option => (
                <FilterCheckbox key={option.id} {...option} />
                ))}
                </div>
        </FilterGroup>

        {/* Breed Filter */}
        <FilterGroup title="Breed">
                <Input placeholder="e.g., Golden Retriever" className="bg-neutral-800 border-neutral-700 text-white"/>
        </FilterGroup>

        {/* Status Filter */}
        <FilterGroup title="Status">
                <div className="space-y-3">
                {statusOptions.map(option => (
                <FilterCheckbox key={option.id} {...option} />
                ))}
                </div>
        </FilterGroup>

        {/* Details Filter (Age, Gender, etc.) */}
        <FilterGroup title="Details">
                <div className="space-y-3">
                {detailOptions.map(option => (
                <FilterCheckbox key={option.id} {...option} />
                ))}
                {/* We will add Age and Gender sliders/dropdowns here later */}
                </div>
        </FilterGroup>

        </aside>
        );
};

export default PetFilters;