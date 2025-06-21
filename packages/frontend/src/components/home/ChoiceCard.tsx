// src/components/home/ChoiceCard.tsx

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { easeOut } from "framer-motion"; 


// Define the props for our flexible card
interface ChoiceCardProps 
{
  imageUrl: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  imagePosition?: 'left' | 'right';
}

const ChoiceCard = (
{
  imageUrl,
  title,
  description,
  buttonText,
  buttonLink,
  imagePosition = 'left', // Default to image on the left
}: ChoiceCardProps) => {

  // Define animation variants for a subtle "fade in and up" on scroll
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeOut }
    },
  };

  return (
    <motion.div
      className="grid grid-cols-1 overflow-hidden rounded-xl border bg-white shadow-sm md:grid-cols-2"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }} // Trigger animation when 30% of the card is visible
    >
      {/* Image Section */}
      <div className={`
        ${imagePosition === 'left' ? 'md:order-1' : 'md:order-2'}
      `}>
        <AspectRatio ratio={4 / 5}>
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
        </AspectRatio>
      </div>

      {/* Content Section */}
      <div className={`
        flex flex-col p-8 sm:p-12 
        ${imagePosition === 'left' ? 'md:order-2' : 'md:order-1'}
      `}>
        <h3 className="text-3xl font-bold text-neutral-800">
          {title}
        </h3>
        <p className="mt-4 flex-grow text-neutral-600">
          {description}
        </p>
        <div className="mt-8">
          <Link to={buttonLink}>
            <Button size="lg" className="group">
              {buttonText}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ChoiceCard;