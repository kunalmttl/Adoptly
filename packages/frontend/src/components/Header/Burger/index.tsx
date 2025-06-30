// # Menu Burger Component (Original Working Version)

import styles from './style.module.scss';

interface BurgerProps {
    isActive: boolean;
    setIsActive: (isActive: boolean) => void;
    textColorClass?: string;
}

export default function Burger({ isActive, setIsActive, textColorClass }: BurgerProps) {
    return (
        <div onClick={() => { setIsActive(!isActive) }} className={styles.button}>
            <div className={`${styles.burger} ${isActive ? styles.burgerActive : ""} ${textColorClass || ''}`}></div>
        </div>
    )
}