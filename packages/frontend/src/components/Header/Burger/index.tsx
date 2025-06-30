// # Menu Burger Component (Original Working Version)

import styles from './style.module.scss';

interface BurgerProps {
    isActive: boolean;
    setIsActive: (isActive: boolean) => void;
}

export default function Burger({ isActive, setIsActive }: BurgerProps) {
    return (
        <div onClick={() => { setIsActive(!isActive) }} className={styles.button}>
            <div className={`${styles.burger} ${isActive ? styles.burgerActive : ""}`}></div>
        </div>
    )
}