// src/components/pets/PetDetailItem.tsx

import type { ReactNode } from 'react';

/**
 * Props for the PetDetailItem component.
 */
interface PetDetailItemProps {
  /** The icon to display next to the detail. */
  icon: ReactNode;
  /** The label for the piece of information (e.g., "Age"). */
  label: string;
  /** The value of the information. Can be a string or number. */
  value: string | number | undefined;
}

/**
 * A reusable UI component for displaying a single, icon-adorned detail
 * on the pet information page. It gracefully handles and hides empty values.
 */
export const PetDetailItem = ({ icon, label, value }: PetDetailItemProps) => {
  // Do not render the component if the value is null, undefined, or an empty string.
  if (value === null || value === undefined || value === '') {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-neutral-700">
        {icon}
      </div>
      <div>
        <p className="text-sm text-neutral-500">{label}</p>
        <p className="font-semibold text-neutral-800">{value}</p>
      </div>
    </div>
  );
};