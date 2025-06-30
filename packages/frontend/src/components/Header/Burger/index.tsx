// # Menu Burger Component

import styles from './style.module.scss';

interface BurgerProps {
    isActive: boolean;
    setIsActive: (isActive: boolean) => void;
}

export default function Burger({ isActive, setIsActive }: BurgerProps) {
    return (
        // * The onClick handler toggles the state
        <div onClick={() => { setIsActive(!isActive) }} className={styles.button}>
            {/* ! FIX: The icon itself, which will animate. No empty label needed. */}
            <div className={`${styles.burger} ${isActive ? styles.burgerActive : ""}`}>
                {/* These two spans will become the lines of the icon */}
                <span></span>
                <span></span>
            </div>
        </div>
    )
}