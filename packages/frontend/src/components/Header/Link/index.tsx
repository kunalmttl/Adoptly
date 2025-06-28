// src/components/Header/Link/index.tsx
import styles from './style.module.scss';
import { Link as RouterLink } from 'react-router-dom'; // Use alias for clarity
import { motion } from 'framer-motion';
import { slide, scale } from '../anim';
interface LinkProps {
    data: {
        title: string;
        href: string;
        index: number;
    };
    isActive: boolean;
    setSelectedIndicator: (href: string) => void;
}

export default function Link({ data, isActive, setSelectedIndicator }: LinkProps) {
    const { title, href, index } = data;

    return (
        <motion.div
            className={styles.link}
            onMouseEnter={() => { setSelectedIndicator(href) }}
            custom={index}
            variants={slide}
            initial="initial"
            animate="enter"
            exit="exit"
        >
            <motion.div
                variants={scale}
                animate={isActive ? "open" : "closed"}
                className={styles.indicator}>
            </motion.div>
            <RouterLink to={href}>{title}</RouterLink>
        </motion.div>
    )
}