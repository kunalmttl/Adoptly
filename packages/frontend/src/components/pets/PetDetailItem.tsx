// # Reusable Pet Detail Item Component

import type { ReactNode } from 'react';

interface PetDetailItemProps {
  icon: ReactNode;
  label: string;
  value: string | number | undefined;
}

export const PetDetailItem = ({ icon, label, value }: PetDetailItemProps) => {
  // ? Don't render the component if the value is null, undefined, or an empty string.
  if (value === null || value === undefined || value === '') {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-beige text-neutral-700">
        {icon}
      </div>
      <div>
        <p className="text-sm text-neutral-500">{label}</p>
        <p className="font-semibold text-neutral-800">{value}</p>
      </div>
    </div>
  );
};