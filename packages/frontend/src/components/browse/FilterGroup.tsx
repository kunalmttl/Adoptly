import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { ReactNode } from "react";

interface FilterGroupProps 
{
  title: string;
  children: ReactNode;
}


const FilterGroup = ({title, children}: FilterGroupProps) => {
  return (
    <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1" className="border-b-0">

                <AccordionTrigger className="py-4 text-base font-bold hover:no-underline font-poppins">
                        {title}
                </AccordionTrigger>

                <AccordionContent className="pt-2 font-montserrat">
                        {children}
                </AccordionContent>

        </AccordionItem>
    </Accordion>
  )
}

export default FilterGroup
