import { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import type { Variants, Easing } from 'framer-motion';
import styles from './style.module.scss';

export default function Curve() {
    const [dimensions, setDimensions] = useState({ height: 0 });

    useEffect(() => {
        setDimensions({ height: window.innerHeight });

        const resize = () => {
            setDimensions({ height: window.innerHeight });
        };
        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('resize', resize);
        };
    }, []);

    const initialPath = `M100 0 L100 ${dimensions.height} Q-100 ${dimensions.height / 2} 100 0`;
    const targetPath = `M100 0 L100 ${dimensions.height} Q100 ${dimensions.height / 2} 100 0`;

    // 👇 Type assertion to fix the easing type
    const customEase = [0.76, 0, 0.24, 1] as Easing;

    const curve: Variants = {
        initial: { d: initialPath },
        enter: { d: targetPath, transition: { duration: 1, ease: customEase } },
        exit: { d: initialPath, transition: { duration: 0.8, ease: customEase } },
    };

    return (
        <svg className={styles.svgCurve}>
            <motion.path
                variants={curve}
                initial="initial"
                animate="enter"
                exit="exit"
                fill="none"
                stroke="white"
                strokeWidth={2}
            />
        </svg>
    );
}
