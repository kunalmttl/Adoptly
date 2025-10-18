// src/components/Header/Burger/index.tsx

import styles from './style.module.scss';

/**
 * Props for the Burger component.
 */
interface BurgerProps {
  /** Whether the navigation menu is currently active (open). */
  isActive: boolean;
  /** A function to toggle the active state of the menu. */
  setIsActive: (isActive: boolean) => void;
  /** An optional CSS class to control the color of the burger lines. */
  textColorClass?: string;
}

/**
 * An animated hamburger menu icon that transforms into an 'X' when active.
 */
export default function Burger({ isActive, setIsActive, textColorClass }: BurgerProps) {
  return (
    <div onClick={() => setIsActive(!isActive)} className={styles.button} aria-label="Toggle menu">
      <div
        className={`${styles.burger} ${isActive ? styles.burgerActive : ''} ${textColorClass || ''}`}
      ></div>
    </div>
  );
}