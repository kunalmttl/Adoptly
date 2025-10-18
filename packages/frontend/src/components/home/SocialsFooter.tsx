// src/components/home/SocialsFooter.tsx

import { SiYoutube, SiFacebook, SiInstagram, SiLinkedin } from 'react-icons/si';
import { FaXTwitter } from 'react-icons/fa6';

import MagneticIcon from './MagneticIcon';
import { useCursor } from '@/context/CursorContext';

// An array of social link data for easy mapping.
const socialLinks = [
  { name: 'Linkedin', href: '#', icon: SiLinkedin },
  { name: 'Youtube', href: '#', icon: SiYoutube },
  { name: 'Facebook', href: '#', icon: SiFacebook },
  { name: 'Twitter', href: '#', icon: FaXTwitter },
  { name: 'Instagram', href: '#', icon: SiInstagram },
];

/**
 * A footer component that displays a row of social media icons,
 * each with a magnetic hover effect. It also manages the custom cursor's
 * z-index to prevent it from overlapping the icons.
 */
const SocialsFooter = () => {
  // Get the z-index setter from the global CursorContext.
  const { setZIndex } = useCursor();

  return (
    <footer
      className="bg-[#101010] py-8"
      // When the mouse enters the footer, lower the cursor's z-index so it appears behind the icons.
      onMouseEnter={() => setZIndex(1)}
      // When the mouse leaves, restore the cursor's high z-index so it's on top of other content.
      onMouseLeave={() => setZIndex(9900)}
    >
      {/* The 'isolation-isolate' class creates a new stacking context, which is crucial
          for the z-index manipulation between the cursor and the icons to work correctly. */}
      <div className="container mx-auto px-4 relative isolation-isolate">
        <div className="flex items-center justify-center space-x-2 md:space-x-4">
          {socialLinks.map((social) => (
            <MagneticIcon key={social.name} href={social.href}>
              <social.icon
                aria-label={social.name}
                className="h-6 w-6 sm:h-7 sm:w-7 text-white transition-colors duration-300 group-hover:text-[#e84430]"
              />
            </MagneticIcon>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default SocialsFooter;