// src/components/browse/FilterCheckbox.tsx

import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

/**
 * Props for the FilterCheckbox component.
 */
interface FilterCheckboxProps {
  /** A unique identifier for the checkbox and its label. */
  id: string;
  /** The text to display next to the checkbox. */
  label: string;
  /** An optional number to display on the right side. */
  count?: number;
  // You would also need props for handling state, e.g.:
  // checked: boolean;
  // onCheckedChange: (checked: boolean) => void;
}

/**
 * A reusable checkbox component designed for use in filter sidebars.
 * It includes a label and an optional count display.
 *
 * NOTE: This component appears to be unused. Consider deleting it if not needed.
 */
const FilterCheckbox = ({ id, label, count }: FilterCheckboxProps) => {
  return (
    <div className="flex items-center justify-between space-x-2">
      <div className="flex items-center space-x-3">
        <Checkbox id={id} />
        <Label htmlFor={id} className="font-normal text-neutral-600">
          {label}
        </Label>
      </div>

      {/* Conditionally render the count if it is provided */}
      {count !== undefined && (
        <span className="text-sm text-neutral-400">({count.toString().padStart(2, '0')})</span>
      )}
    </div>
  );
};

export default FilterCheckbox;