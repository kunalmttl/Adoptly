// src/components/ui/form-label-with-indicator.tsx

import { Label } from "@/components/ui/label";
import type { ComponentPropsWithoutRef } from "react";

// Add a new 'required' prop to the standard Label props
type FormLabelWithIndicatorProps = ComponentPropsWithoutRef<typeof Label> & 
{
  required?: boolean;
};

export const FormLabelWithIndicator = ({children, required, ...props}: FormLabelWithIndicatorProps) => 
{
  return (
    <Label {...props}>
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </Label>
  );
};