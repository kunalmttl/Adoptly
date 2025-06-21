import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'

const PetSearch = () => {
  return (
    <div className='relative w-full ml-10 mr-10'>
      <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400'/>
      <Input className='pl-10 pr-32 h-12 text-base' placeholder="Search for 'Golden Retriever'..." type = "text"/>
      <div className="absolute right-1 top-1/2 -translate-y-1/2">
        <Select defaultValue="breed">
          <SelectTrigger className="w-[110px] bg-neutral-100 border-none focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="breed">Breed</SelectItem>
            <SelectItem value="name">Pet Name</SelectItem>
          </SelectContent>
        </Select>
      </div> 
    </div>
  )
}

export default PetSearch
