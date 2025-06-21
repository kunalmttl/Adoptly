// src/pages/BrowsePetsPage.tsx

import PetCard from "@/components/browse/PetCard";
import { motion } from "framer-motion";


const BrowsePetsPage = () => 
{
      const samplePets = [
      { id: "1", name: "Buddy", age: 3, isVaccinated: true, status: 'available' as const, imageUrl: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg" },
      { id: "2", name: "Lucy", age: 2, isVaccinated: true, status: 'available' as const, imageUrl: "https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg" },
      { id: "3", name: "Max", age: 5, isVaccinated: false, status: 'pending' as const, imageUrl: "https://images.pexels.com/photos/33053/dog-young-dog-small-dog-maltese.jpg" },
      { id: "4", name: "Daisy", age: 1, isVaccinated: true, status: 'available' as const, imageUrl: "https://images.pexels.com/photos/374898/pexels-photo-374898.jpeg" },
      { id: "5", name: "Rocky", age: 4, isVaccinated: true, status: 'available' as const, imageUrl: "https://images.pexels.com/photos/58997/pexels-photo-58997.jpeg" },
      { id: "6", name: "Molly", age: 6, isVaccinated: true, status: 'adopted' as const, imageUrl: "https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg" },
      ];


      const containerVariants = 
      {
        hidden: { opacity: 0 },
        visible: 
        {
          opacity: 1,
          transition: {staggerChildren: 0.1}
        }
      };

  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Available Pets</h1>
        {/* We will add sort controls here later */}
      </div>

      {/* Pet Cards Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {samplePets.map((pet) => (
          <PetCard key={pet.id} {...pet} />
        ))}
      </motion.div>
    </div>
  );
}

export default BrowsePetsPage;