// src/components/Header/Link/index.tsx

import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { slide, scale } from '../anim';
import styles from './style.module.scss';

/**
 * Props for the animated Link component.
 */
interface LinkProps {
  data: {
    title: string;
    href: string;
    index: number;
    action?: () => void; // An optional action for non-navigation items like 'Logout'.
  };
  /** Whether this link is the currently active or hovered link. */
  isActive: boolean;
  /** A callback to set the currently hovered link in the parent component. */
  setSelectedIndicator: (href: string) => void;
}

/**
 * A single animated navigation link for the slide-out menu.
 * It handles both standard navigation (via React Router) and custom actions.
 */
export default function Link({ data, isActive, setSelectedIndicator }: LinkProps) {
  const { title, href, index, action } = data;

  // Conditionally render a button for actions, or a RouterLink for navigation.
  const content = action ? (
    <button onClick={action}>{title}</button>
  ) : (
    <RouterLink to={href}>{title}</RouterLink>
  );

  return (
    <motion.div
      className={styles.link}
      onMouseEnter={() => setSelectedIndicator(href)}
      custom={index} // Pass the index for staggered animation delay.
      variants={slide}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      {/* The small dot indicator that animates next to the active link. */}
      <motion.div
        variants={scale}
        animate={isActive ? 'open' : 'closed'}
        className={styles.indicator}
      ></motion.div>
      {content}
    </motion.div>
  );
}