// src/components/Header/Nav/index.tsx
import { useState } from 'react'
import styles from './style.module.scss';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom'; // <-- React Router's hook
import { menuSlide } from '../anim'; // This is correct (up one level from Nav to Header)
import Link from '../Link';         // This is incorrect, should be ../Link
import Curve from '../Curve';    // We will create this next

const navItems = [
    { title: "Home", href: "/" },
    { title: "Browse Pets", href: "/browse" },
    { title: "List a Pet", href: "/sell" },
    { title: "Contact", href: "/contact" },
]

export default function Nav() {
    const location = useLocation();
    const [selectedIndicator, setSelectedIndicator] = useState(location.pathname);

    return (
        <div className='font-montserrat'>
            <motion.div
                variants={menuSlide}
                initial="initial"
                animate="enter"
                exit="exit"
                className={styles.menu}
            >
                <div className={styles.body}>
                    <div onMouseLeave={() => { setSelectedIndicator(location.pathname) }} className={styles.nav}>
                        <div className={styles.header}>
                            <p>Navigation</p>
                        </div>
                        {
                            navItems.map((data, index) => {
                                return <Link
                                    key={index}
                                    data={{ ...data, index }}
                                    isActive={selectedIndicator == data.href}
                                    setSelectedIndicator={setSelectedIndicator}>
                                </Link>
                            })
                        }
                    </div>
            
                </div>
                <Curve />
            </motion.div>
        </div>
    )
}