// src/components/home/ChoiceCard.tsx

import { Link } from 'react-router-dom';
// FIXED: Import the 'Variants' type from framer-motion for explicit typing.
import { motion, type Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';

/**
 * Props for the ChoiceCard component.
 */
interface ChoiceCardProps {
  /** The URL of the image to display. */
  imageUrl: string;
  /** The main title of the card. */
  title: string;
  /** The descriptive text for the card. */
  description: string;
  /** The text to display on the call-to-action button. */
  buttonText: string;
  /** The URL the button should link to. */
  buttonLink: string;
  /** The position of the image ('left' or 'right'). Defaults to 'left'. */
  imagePosition?: 'left' | 'right';
}

/**
 * A large, two-column card component used on the homepage to present
 * primary user actions, such as adopting or listing a pet.
 * It features a scroll-triggered fade-in animation.
 */
const ChoiceCard = ({
  imageUrl,
  title,
  description,
  buttonText,
  buttonLink,
  imagePosition = 'left',
}: ChoiceCardProps) => {
  // Animation variants for a subtle "fade in and up" effect on scroll.
  // FIXED: Explicitly typed with the 'Variants' type from framer-motion.
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      // FIXED: Used the string "easeOut" which is a valid value for the ease property.
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-xl border bg-white shadow-sm"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      // Trigger the animation when 30% of the card is visible in the viewport.
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* Image Section */}
      <div className={imagePosition === 'left' ? 'md:order-1' : 'md:order-2'}>
        <AspectRatio ratio={4 / 5}>
          <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
        </AspectRatio>
      </div>

      {/* Content Section */}
      <div className={`flex flex-col p-8 sm:p-12 ${imagePosition === 'left' ? 'md:order-2' : 'md:order-1'}`}>
        <h3 className="text-3xl font-bold text-neutral-800">{title}</h3>
        <p className="mt-4 flex-grow text-neutral-600">{description}</p>
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