// # Pet Info Display Component

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PetDetailItem } from './PetDetailItem'; // * Import the new component
import type { Pet } from '@/api/petAPI';

import { 
  PawPrint, 
  Dog, 
  Cat, 
  Bird, 
  Rabbit,
  Cake,
  HeartPulse,
  Ruler,
  Weight,
  DollarSign,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

const speciesIcons = {
  dog: <Dog className="mr-2 h-5 w-5" />,
  cat: <Cat className="mr-2 h-5 w-5" />,
  bird: <Bird className="mr-2 h-5 w-5" />,
  rabbit: <Rabbit className="mr-2 h-5 w-5" />,
  other: <PawPrint className="mr-2 h-5 w-5" />,
};

export const PetInfo = ({ pet }: { pet: Pet }) => {
  return (
    <div className="space-y-6 font-montserrat">
      {/* # Header Section */}
      <div>
        <div className="flex items-center gap-2 text-sm text-neutral-500 uppercase tracking-wide">
          {speciesIcons[pet.species.toLowerCase() as keyof typeof speciesIcons] || speciesIcons.other}
          <span>{pet.species}</span>
        </div>
        <h1 className="mt-2 text-4xl font-poppins font-bold text-neutral-900">{pet.name}</h1>
        <p className="mt-1 text-lg text-neutral-600">{pet.breed}</p>
      </div>

      <Separator />

      {/* # About Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-poppins font-semibold">About {pet.name}</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          <PetDetailItem icon={<Cake size={20} />} label="Age" value={pet.age ? `${pet.age} years` : 'N/A'} />
          <PetDetailItem icon={<HeartPulse size={20} />} label="Gender" value={pet.gender ? pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1) : 'N/A'} />
          <PetDetailItem icon={<Ruler size={20} />} label="Height" value={pet.size?.height ? `${pet.size.height} cm` : undefined} />
          <PetDetailItem icon={<Weight size={20} />} label="Weight" value={pet.size?.weight ? `${pet.size.weight} kg` : undefined} />
        </div>
        <p className="text-neutral-700 leading-relaxed pt-2">{pet.description}</p>
      </div>

      <Separator />

      {/* # Health & Wellness Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-poppins font-semibold">Health & Wellness</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          <PetDetailItem icon={<ShieldCheck size={20} />} label="Vaccinated" value={pet.health_status.vaccinated ? 'Yes' : 'No'} />
          <PetDetailItem icon={<AlertTriangle size={20} />} label="Special Needs" value={pet.health_status.special_needs ? 'Yes' : 'No'} />
        </div>
      </div>

      <Separator />

      {/* # Adoption Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-poppins font-semibold">Adoption Details</h3>
        <div className="grid grid-cols-2 gap-4">
            <PetDetailItem icon={<DollarSign size={20} />} label="Adoption Fee" value={`$${pet.adoption_fee}`} />
            <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-beige text-neutral-700">
                    <PawPrint size={20} />
                </div>
                <div>
                    <p className="text-sm text-neutral-500">Status</p>
                    <Badge className="capitalize text-sm" variant={pet.status === 'available' ? 'default' : 'secondary'}>
                      {pet.status}
                    </Badge>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};