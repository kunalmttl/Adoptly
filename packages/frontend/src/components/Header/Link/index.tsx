// # Navigation Link Component

import styles from './style.module.scss';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { slide, scale } from '../anim';

interface LinkProps {
    data: {
        title: string;
        href: string;
        index: number;
        action?: () => void; // ? Make action optional
    };
    isActive: boolean;
    setSelectedIndicator: (href: string) => void;
}

export default function Link({ data, isActive, setSelectedIndicator }: LinkProps) {
    const { title, href, index, action } = data;

    // =-= Conditionally render a button for actions, or a link for navigation
    const content = action ? (
        <button onClick={action}>{title}</button>
    ) : (
        <RouterLink to={href}>{title}</RouterLink>
    );

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
            {content}
        </motion.div>
    )
}