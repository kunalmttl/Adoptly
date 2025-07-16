// src/pages/HomePage.tsx

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion"; 
import Preloader from "@/components/common/Preloader";
import InfoCard from "@/components/home/InfoCard";
import { HeartHandshake, Users, Dog } from "lucide-react";
import ChoiceCard from "@/components/home/ChoiceCard";
import SocialsFooter from "@/components/home/SocialsFooter"; 


// Animation variants for the main text container
const headingContainerVariants: Variants = {
  hidden: {}, // Can be empty if we only use it for staggerChildren
  visible: {
    transition: {
      staggerChildren: 0.4, // Stagger the animation of children
    },
  },
};

// Animation variants for each line of the heading
const headingItemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    // Using a string for the 'ease' property to satisfy TypeScript types
    transition: { duration: 0.8, ease: "easeOut" }, 
  },
};

const HomePage = () => 
  {
  // State to manage the pre-loader visibility
  const [isLoading, setIsLoading] = useState(true);

  // Simulate a loading process with a timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // The pre-loader will be visible for 3 seconds

    // Cleanup function to clear the timer when the component unmounts
    return () => clearTimeout(timer);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <>
      {/* 
        AnimatePresence handles the exit animation of the Preloader when it's
        removed from the component tree (when isLoading becomes false).
      */}
      <div className="bg-orange-50">
        <AnimatePresence>
          {isLoading && <Preloader />}
        </AnimatePresence>
        {/* Hero Section */}
        <section className="font-poppins h-screen w-full overflow-hidden bg-black absolute top-0">
          {/* Background Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute h-full w-full object-cover"
            src="https://videos.pexels.com/video-files/3191251/3191251-uhd_2732_1440_25fps.mp4"
          />
          {/* Darkening Overlay */}
          <div className="absolute top-0 left-0 z-10 h-full w-full bg-black/50" />
        
          {/* Content */}
          <div className="font-poppins relative z-20 flex h-full flex-col items-start  justify-end py-10 p-5 text-center text-white">
            <motion.h1
              className="
                text-right font-black leading-none
                text-[5rem] md:text-[5rem] lg:text-[10rem]
              "
              variants={headingContainerVariants}
              initial="hidden"
              animate={!isLoading ? "visible" : "hidden"} // Animate only when loading is done
            >
              <motion.span className="group relative h-50 w-50 inline-block cursor-pointer font-pacifico text-white" variants={headingItemVariants}>
                adoptly
                <span className="absolute -bottom-1 left-0 h-[6px] w-0 bg-white transition-all duration-500 group-hover:w-full" />
              </motion.span>
            </motion.h1>
          </div>
        </section>
        {/* Second Section to allow scrolling */}
        <section className="bg-orange-50 mx-24 py-16 sm:py-24 mt-[100vh]">
          <div className="container mx-auto px-4 bg-orange-50">
        
            {/* Section Header */}
            <div className="mb-16 text-center bg-orange-50">
              <h2 className="font-poppins text-4xl font-bold text-neutral-800"> WHY CHOOSE ADOPTLY? </h2>
              <p className="font-montserrat mt-2 text-lg text-neutral-600"> Because we enable direct pet adoption, from one good home to another.</p>
            </div>
        
            {/* Cards Grid */}
            <div className="font-montserrat mt-4 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        
              {/* Card 1 */}
              <InfoCard
                icon={<HeartHandshake size={48} className="text-orange-600" />}
                title="Ethical & Kind">
                <p className="mb-4">We believe that...</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Every pet deserves to be safe, loved, and respected.</li>
                  <li>Great people seeking to adopt shouldn't face complicated, one-size-fits-all rules.</li>
                  <li>Rehoming a pet should be an empowering and judgment-free process.</li>
                </ul>
              </InfoCard>
              {/* Card 2 */}
              <InfoCard
                icon={<Dog size={48} className="text-orange-600" />}
                title="Adoption First">
                <p> Our platform champions adoption, directly reducing the demand for puppy farming and unethical breeding. We provide a safe, transparent alternative to marketplaces where pets are treated like products. We are proud supporters of #AdoptDontShop. </p>
              </InfoCard>
              {/* Card 3 */}
              <InfoCard
                icon={<Users size={48} className="text-orange-600" />}
                title="Direct & Simple">
                <p> We're champions of rehoming, but not at any cost. By connecting good people with good pets directly, we foster a community built on trust and mutual respect, ensuring a better match for everyone involved. </p>
              </InfoCard>
            </div>
          </div>
        </section>
        {/* Choice Section */}
        <section className="bg-orange-50 mx-24 py-16 sm:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              {/* Card 1: Find a Pet */}
              <ChoiceCard
                imageUrl="https://st4.depositphotos.com/4312829/23693/i/450/depositphotos_236933870-stock-photo-cute-little-staff-terrier-puppy.jpg"
                title="Find a Friend"
                description="Begin your search for the perfect companion. Browse hundreds of profiles of loving pets waiting for a family just like yours."
                buttonText="Browse Pets"
                buttonLink="/browse"
                imagePosition="left"
              />
              {/* Card 2: List a Pet */}
              <ChoiceCard
                imageUrl="https://scontent.fbho3-4.fna.fbcdn.net/v/t1.6435-9/35381387_10155948847421107_2389321479637434368_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_ohc=-DGo5zNw2uEQ7kNvwFgQ6HS&_nc_oc=AdlqsDaO3fHdGa7u53rRKYMEXSvbc6gyM5zEOBXMXjpFFFswB_E48cxDby0ADWIcAEM&_nc_zt=23&_nc_ht=scontent.fbho3-4.fna&_nc_gid=BA1xBfRU3DZjRMNqsd6bqQ&oh=00_AfPx9d_NTC_EdedKPokIsAIHlwU-WmPZAZJSONG0-i9ucA&oe=688A02F5"
                title="Rehome Your Pet"
                description="Give your pet a chance at a new loving home. Our simple and secure process helps you find the best possible match."
                buttonText="List Your Pet"
                buttonLink="/sell"
                imagePosition="right"
              />
            </div>
          </div>
        </section>
        {/* Socials Footer */}
        <SocialsFooter />
        {/* Footer */}
      </div>
    </>
  );
};

export default HomePage;