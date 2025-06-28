// frontend/src/components/pets/PetInfo.tsx
import { Badge } from '@/components/ui/badge';
import { PawPrint, ShieldCheck, Dog, Cat, Bird, Rabbit } from 'lucide-react';
import type { Pet } from '@/api/petAPI'; // <-- Import the canonical Pet type

const speciesIcons = {
  dog: <Dog className="mr-2 h-5 w-5" />,
  cat: <Cat className="mr-2 h-5 w-5" />,
  bird: <Bird className="mr-2 h-5 w-5" />,
  rabbit: <Rabbit className="mr-2 h-5 w-5" />,
  other: <PawPrint className="mr-2 h-5 w-5" />,
};

export const PetInfo = ({ pet }: { pet: Pet }) => { // <-- Accept the whole Pet object
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-neutral-500 uppercase tracking-wide">
          {speciesIcons[pet.species.toLowerCase() as keyof typeof speciesIcons] || speciesIcons.other}
          <span>{pet.species}</span>
        </div>
        <h1 className="mt-2 text-4xl font-bold text-neutral-900">{pet.name}</h1>
        <p className="mt-1 text-lg text-neutral-600">{pet.breed}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {pet.age && <Badge variant="secondary">{pet.age} {pet.age === 1 ? 'year' : 'years'} old</Badge>}
        {pet.gender && <Badge variant="secondary" className="capitalize">{pet.gender}</Badge>}
        {pet.health_status?.vaccinated && ( // <-- Safely access nested property
          <Badge variant="outline" className="border-green-600 bg-green-50 text-green-700">
            <ShieldCheck className="mr-1 h-3 w-3" /> Vaccinated
          </Badge>
        )}
      </div>

      <p className="text-neutral-700 leading-relaxed">{pet.description}</p>
    </div>
  );
};