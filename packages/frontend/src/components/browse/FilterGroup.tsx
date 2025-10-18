// src/components/browse/FilterGroup.tsx

import type { ReactNode } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

/**
 * Props for the FilterGroup component.
 */
interface FilterGroupProps {
  /** The title displayed in the accordion trigger. */
  title: string;
  /** The content (filter controls) to be displayed inside the collapsible area. */
  children: ReactNode;
}

/**
 * A reusable UI component that wraps a set of filters in a collapsible accordion.
 * This helps to keep the filter sidebar organized and clean.
 */
const FilterGroup = ({ title, children }: FilterGroupProps) => {
  return (
    <Accordion type="single" collapsible defaultValue="item-1" className="border-b">
      <AccordionItem value="item-1" className="border-b-0">
        <AccordionTrigger className="py-4 text-base font-semibold hover:no-underline">
          {title}
        </AccordionTrigger>
        <AccordionContent className="pt-2">{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FilterGroup;