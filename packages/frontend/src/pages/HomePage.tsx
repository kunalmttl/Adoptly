// src/pages/HomePage.tsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

import Preloader from '@/components/common/Preloader';
import InfoCard from '@/components/home/InfoCard';
import ChoiceCard from '@/components/home/ChoiceCard';
import SocialsFooter from '@/components/home/SocialsFooter';
import { HeartHandshake, Users, Dog } from 'lucide-react';

// Animation variants for the main heading container to stagger children.
const headingContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.4,
    },
  },
};

// Animation variants for each line of the heading text.
const headingItemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

/**
 * The main landing page of the application.
 * It features a hero video, animated text, informational sections, and calls to action.
 */
const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate an initial loading period to show the preloader animation.
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="bg-orange-50">
        {/* AnimatePresence handles the exit animation of the Preloader. */}
        <AnimatePresence>{isLoading && <Preloader />}</AnimatePresence>

        {/* --- Hero Section --- */}
        <section className="h-screen w-full overflow-hidden bg-black absolute top-0">
          <video autoPlay loop muted playsInline className="absolute h-full w-full object-cover" src="https://videos.pexels.com/video-files/3191251/3191251-uhd_2732_1440_25fps.mp4" />
          <div className="absolute top-0 left-0 z-10 h-full w-full bg-black/50" />
          <div className="relative z-20 flex h-full flex-col items-start justify-end p-5 text-white">
            <motion.h1 className="text-left font-black leading-none text-[5rem] md:text-[8rem] lg:text-[10rem]" variants={headingContainerVariants} initial="hidden" animate={!isLoading ? 'visible' : 'hidden'}>
              <motion.span className="group relative inline-block cursor-pointer font-pacifico" variants={headingItemVariants}>
                adoptly
                <span className="absolute -bottom-1 left-0 h-[6px] w-0 bg-white transition-all duration-500 group-hover:w-full" />
              </motion.span>
            </motion.h1>
          </div>
        </section>

        {/* --- "Why Choose Us" Section --- */}
        {/* mt-[100vh] pushes this section below the full-screen hero. */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24 mt-[100vh]">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold text-neutral-800">WHY CHOOSE ADOPTLY?</h2>
            <p className="mt-2 text-lg text-neutral-600">Because we enable direct pet adoption, from one good home to another.</p>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <InfoCard icon={<HeartHandshake size={48} className="text-orange-600" />} title="Ethical & Kind">
              <p className="mb-4">We believe that...</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Every pet deserves to be safe, loved, and respected.</li>
                <li>Great people seeking to adopt shouldn't face complicated rules.</li>
                <li>Rehoming a pet should be an empowering and judgment-free process.</li>
              </ul>
            </InfoCard>
            <InfoCard icon={<Dog size={48} className="text-orange-600" />} title="Adoption First">
              <p>Our platform champions adoption, directly reducing the demand for puppy farming and unethical breeding. We provide a safe, transparent alternative to marketplaces where pets are treated like products. We are proud supporters of #AdoptDontShop.</p>
            </InfoCard>
            <InfoCard icon={<Users size={48} className="text-orange-600" />} title="Direct & Simple">
              <p>By connecting good people with good pets directly, we foster a community built on trust and mutual respect, ensuring a better match for everyone involved.</p>
            </InfoCard>
          </div>
        </section>

        {/* --- "Choice" Section (Adopt vs. Rehome) --- */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
            <ChoiceCard imageUrl="https://st4.depositphotos.com/4312829/23693/i/450/depositphotos_236933870-stock-photo-cute-little-staff-terrier-puppy.jpg" title="Find a Friend" description="Begin your search for the perfect companion. Browse hundreds of profiles of loving pets waiting for a family just like yours." buttonText="Browse Pets" buttonLink="/browse" imagePosition="left" />
            <ChoiceCard imageUrl="https://api.army.mil/e2/c/images/2012/05/03/245957/original.jpg" title="Rehome Your Pet" description="Give your pet a chance at a new loving home. Our simple and secure process helps you find the best possible match." buttonText="List Your Pet" buttonLink="/sell" imagePosition="right" />
          </div>
        </section>

        <SocialsFooter />
      </div>
    </>
  );
};

export default HomePage;