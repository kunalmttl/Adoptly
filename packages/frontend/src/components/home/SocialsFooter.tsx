// src/components/home/SocialsFooter.tsx

import { motion } from "framer-motion";
import {
    Twitter,
    Youtube,
    Facebook,
    Instagram,
    Linkedin,
} from "lucide-react";

// Store social links in an array for cleaner code
const socialLinks = [
    { name: "Linkedin", href: "#", icon: Linkedin },
    { name: "Youtube", href: "#", icon: Youtube },
    { name: "Facebook", href: "#", icon: Facebook },
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "Instagram", href: "#", icon: Instagram },
];


const SocialsFooter = () => {
    return (
        <footer className="bg-rose-400 py-8">
            <div className="container mx-auto px-4">
                
                {/* Flex container to center the icons */}
                <div className="flex items-center justify-center space-x-6 md:space-x-8">
                    
                    {/* Map over the array to render each icon */}
                    {socialLinks.map((social) => (
                        <motion.a
                                key={social.name}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Follow us on ${social.name}`}
                                className="text-white"
                                whileHover={{ scale: 1.3, y: -5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                >
                                <social.icon className="h-6 w-6 sm:h-7 sm:w-7" />
                        </motion.a>
                    ))}

                </div>
            </div>
        </footer>
    );
};

export default SocialsFooter;