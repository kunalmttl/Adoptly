import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";


interface FilterCheckboxProps 
{
  id: string;
  label: string;
  count?: number; // The count is optional
}

const FilterCheckbox = ({id, label, count} : FilterCheckboxProps) => {
  return (
    <div>
      <div className="flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-3">
                <Checkbox id={id} />
                <Label htmlFor={id} className="font-normal text-neutral-300">
                        {label}
                </Label>
        </div>

        {count !== undefined && (
        <span className="text-sm text-neutral-400">
          ({count.toString().padStart(2, '0')})
        </span>)}
        
      </div>
    </div>
  )
}

export default FilterCheckbox
