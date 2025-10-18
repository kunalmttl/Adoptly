// # Slide-out Navigation Panel

import { useState } from 'react';
import styles from './style.module.scss';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useAuthStore } from '@/store/authStore';
import { menuSlide } from '../anim';
import Link from '../Link';
import Curve from '../Curve';

// ? Base navigation items, always visible
const baseNavItems = [
    { title: "Home", href: "/" },
    { title: "Browse Pets", href: "/browse" },
    { title: "List a Pet", href: "/sell" },
];

export default function Nav() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [selectedIndicator, setSelectedIndicator] = useState(location.pathname);

    const handleLogout = () => {
        logout();
        toast.success("You have been logged out.");
        navigate("/");
    };

    // # Dynamically create the final nav items array
    const navItems = [
        ...baseNavItems,
        user
            ? { title: "Logout", href: "#logout", action: handleLogout } // =-= If user exists, show Logout
            : { title: "Login / Register", href: "/login" } // =-= Otherwise, show Login
    ];

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
                        <div className={`${styles.header} flex items-center justify-between px-4 py-2 mt-25`}>
                        <p>Navigation</p>
                        </div>
                        {
                            navItems.map((data, index) => {
                                return <Link
                                    key={index}
                                    data={{ ...data, index }}
                                    isActive={selectedIndicator === data.href}
                                    setSelectedIndicator={setSelectedIndicator}>
                                </Link>
                            })
                        }
                    </div>
                </div>

                <div className={styles.source}>
                    <a href="https://www.github.com/kunalmttl/adoptly" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium hover:underline">
                    <span className='font-mono color-gray-800'> view source code </span>
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" className='w-7 h-7' />
                    </a>
                </div>
                <Curve />
            </motion.div>
        </div>
    )
}