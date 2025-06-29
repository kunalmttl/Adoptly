// # Socials Footer with Magnetic Icons

import MagneticIcon from './MagneticIcon';
import {
  SiTwitter,
  SiYoutube,
  SiFacebook,
  SiInstagram,
  SiLinkedin,
} from "react-icons/si";

const socialLinks = [
    { name: "Linkedin", href: "#", icon: SiLinkedin },
    { name: "Youtube", href: "#", icon: SiYoutube },
    { name: "Facebook", href: "#", icon: SiFacebook },
    { name: "Twitter", href: "#", icon: SiTwitter },
    { name: "Instagram", href: "#", icon: SiInstagram },
];

const SocialsFooter = () => {
    return (
        <footer className="bg-[#101010] py-8">
            {/* ! FIX: Add 'relative' and 'isolation-isolate' to create a new stacking context. */}
            <div className="container mx-auto px-4 relative isolation-isolate">
                <div className="flex items-center justify-center space-x-2 md:space-x-4">
                    
                    {/* =-= The MagneticIcon components now have z-index: 10, placing them above the background */}
                    {/* =-= The cursor will blend with the footer's background but appear *under* the icons */}
                    {socialLinks.map((social) => (
                        <MagneticIcon key={social.name} href={social.href}>
                            <social.icon 
                                aria-label={social.name}
                                className="h-6 w-6 sm:h-7 sm:w-7 text-white transition-colors duration-300 group-hover:text-[#ff9496]" 
                            />
                        </MagneticIcon>
                    ))}

                </div>
            </div>
        </footer>
    );
};

export default SocialsFooter;