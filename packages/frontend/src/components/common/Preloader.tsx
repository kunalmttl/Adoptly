// src/components/common/Preloader.tsx

import { motion } from 'framer-motion';
import type {Variants} from 'framer-motion';

// Explicitly typing the variant objects
const containerVariants: Variants = {
    initial: { y: 0 },
    slideUp: {
        y: "-100vh",
        transition: { duration: 1.0, ease: "easeInOut" }
    }
};

const textVariants: Variants = {
    initial: { opacity: 1 },
    exit: {
        opacity: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

const Preloader = () => {
    return (
        <motion.div
            className="fixed top-0 left-0 z-[10000] flex h-screen w-full items-center justify-center bg-black"
            variants={containerVariants}
            initial="initial"
            exit="slideUp"
        >
            <motion.p
                className="text-lg text-neutral-400"
                variants={textVariants}
                initial="initial"
                exit="exit"
            >
                Rescue a heart, find a friend.
            </motion.p>
        </motion.div>
    );
};

export default Preloader;
