// src/components/applications/ApplicationStatusFilter.tsx

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ListFilter } from 'lucide-react';

/**
 * Defines the possible status values for filtering, including 'all'.
 */
export type ApplicationStatus = 'all' | 'pending' | 'approved' | 'rejected';

/**
 * Props for the ApplicationStatusFilter component.
 */
interface ApplicationStatusFilterProps {
  /** A callback function that is invoked when the filter value changes. */
  onFilterChange: (status: ApplicationStatus) => void;
}

/**
 * A UI component that provides a set of toggle buttons to filter applications by their status.
 * It is a controlled component, meaning the parent page manages the state.
 */
export const ApplicationStatusFilter = ({ onFilterChange }: ApplicationStatusFilterProps) => {
  return (
    // The sticky container keeps the filter bar visible at the top of the screen when scrolling.
    <div className="sticky top-24 z-10 bg-neutral-50 py-4 mb-8">
      <div className="flex items-center gap-4 p-4 rounded-lg bg-white shadow-sm">
        <ListFilter className="h-5 w-5 text-neutral-500" />
        <h3 className="font-semibold text-neutral-700">Filter by Status:</h3>
        <ToggleGroup
          type="single"
          defaultValue="all"
          onValueChange={(value: ApplicationStatus) => {
            // If the user deselects all options, the value becomes empty.
            // We default back to 'all' to ensure a filter is always active.
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