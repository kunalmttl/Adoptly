// # Socials Footer with Magnetic Icons

import MagneticIcon from './MagneticIcon';
import { useCursor } from '@/context/CursorContext'; // * Import the cursor hook
import {
  SiYoutube,
  SiFacebook,
  SiInstagram,
  SiLinkedin,
} from "react-icons/si";
import { FaXTwitter } from "react-icons/fa6";

const socialLinks = [
    { name: "Linkedin", href: "#", icon: SiLinkedin },
    { name: "Youtube", href: "#", icon: SiYoutube },
    { name: "Facebook", href: "#", icon: SiFacebook },
    { name: "Twitter", href: "#", icon: FaXTwitter },
    { name: "Instagram", href: "#", icon: SiInstagram },
];

const SocialsFooter = () => {
    // * Get the z-index setter from the context
    const { setZIndex } = useCursor();

    return (
        <footer 
            className="bg-[#101010] py-8"
            // ! FIX: Add event handlers to the footer itself to control the cursor's z-index
            onMouseEnter={() => setZIndex(1)} // =-= Lower the z-index so it's behind the icons
            onMouseLeave={() => setZIndex(9900)} // =-= Restore the high z-index when leaving the footer
        >
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