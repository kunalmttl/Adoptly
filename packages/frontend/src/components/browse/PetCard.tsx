import {motion} from 'framer-motion';
import { AspectRatio } from '../ui/aspect-ratio';
import { Badge } from '../ui/badge';
import { Heart, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // * Import useNavigate
import { toast } from 'sonner'; // * Import Sonner for toasts
import { useAuthStore } from '@/store/authStore';
import type { PetLocation } from '@/api/petAPI';

interface PetCardProps 
{
  id: string; // We need an ID to link to the details page
  imageUrl: string;
  name: string;
  age: number;
  isVaccinated: boolean;
  location: PetLocation;
  status: 'available' | 'pending' | 'adopted';
}


const PetCard = ({ id, imageUrl, name, age, isVaccinated, status , location}: PetCardProps) => 
{
        const { user } = useAuthStore(); // * Get the current user state
        const navigate = useNavigate(); // * Initialize useNavigate


        // Define animation for when the card appears in the grid
        const cardVariants = 
        {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        };

        const handleCardClick = () => 
        {
                if (user) {
                // =-= If user is logged in, proceed to the pet's page
                navigate(`/pets/${id}`);
                } else {
                // ! If user is a guest, show a toast and redirect to login
                toast.error("You must be logged in to view pet details.");
                navigate('/login');
                }
        };

        return (
        
        <motion.div
      variants={cardVariants}
      onClick={handleCardClick}
      className="cursor-pointer"
    >
      <div className="group overflow-hidden rounded-lg">
        {/* Image Section */}
        <div className="overflow-hidden">
          <AspectRatio ratio={1 / 1}>
            <img src={imageUrl} alt={name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
          </AspectRatio>
        </div>
      
        {/* Content Section */}
        <div className="p-4 bg-white">
          <h3 className="text-lg font-bold text-neutral-800 group-hover:text-indigo-600 transition-colors"> {name} </h3>
          <p className="text-sm text-neutral-500"> {age} {age === 1 ? 'year' : 'years'} old </p>
          <p className="text-sm text-neutral-500"> {location.city}, {location.country} </p>
          
          {/* Status Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {status === 'available' && (
              <Badge variant="secondary" className="border-green-300 bg-green-300 text-gray-800">
                <Heart className="mr-1 h-3 w-3 color-red-500 outline-red-500 fill-red-500" /> Available
              </Badge>
            )}
            {status === 'pending' && (
              <Badge variant="outline" className="border-amber-300 bg-amber-300 text-white">
                Pending
              </Badge>
            )}
            {isVaccinated && (
              <Badge variant="secondary" className="bg-blue-500 text-white dark:bg-blue-600">
                <ShieldCheck className="mr-1 h-3 w-3" /> Vaccinated
              </Badge>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PetCard;