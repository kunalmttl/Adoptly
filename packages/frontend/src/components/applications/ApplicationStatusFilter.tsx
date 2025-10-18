// # Application Status Filter Component

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ListFilter } from "lucide-react";

// * Define the possible status values, including 'all'
export type ApplicationStatus = 'all' | 'pending' | 'approved' | 'rejected';

interface ApplicationStatusFilterProps {
  // =-= This function will be passed from the parent page to update its state
  onFilterChange: (status: ApplicationStatus) => void;
}

export const ApplicationStatusFilter = ({ onFilterChange }: ApplicationStatusFilterProps) => {
  return (
    // # Sticky container for the filter bar
    <div className="sticky top-24 z-10 bg-neutral-50 py-4 mb-8">
      <div className="flex items-center gap-4 p-4 rounded-lg bg-white shadow-sm">
        <ListFilter className="h-5 w-5 text-neutral-500" />
        <h3 className="font-semibold text-neutral-700">Filter by Status:</h3>
        <ToggleGroup
          type="single"
          defaultValue="all"
          onValueChange={(value: ApplicationStatus) => {
            // ? If the user deselects everything, default back to 'all'
            onFilterChange(value || 'all');
          }}
          className="flex-wrap"
        >
          <ToggleGroupItem value="all">All</ToggleGroupItem>
          <ToggleGroupItem value="pending">Pending</ToggleGroupItem>
          <ToggleGroupItem value="approved">Approved</ToggleGroupItem>
          <ToggleGroupItem value="rejected">Rejected</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};