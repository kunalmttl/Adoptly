// src/components/Header/Nav/index.tsx

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Github } from 'lucide-react';

import { useAuthStore } from '@/store/authStore';
import { menuSlide } from '../anim';
import Link from '../Link';
import Curve from '../Curve';
import styles from './style.module.scss';

// Base navigation items visible to all users.
const baseNavItems = [
  { title: 'Home', href: '/' },
  { title: 'Browse Pets', href: '/browse' },
  { title: 'List a Pet', href: '/sell' },
];

/**
 * The main slide-out navigation panel component.
 * It displays navigation links, dynamically adjusting them based on the user's
 * authentication status, and includes complex animations.
 */
export default function Nav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  // State to track the currently hovered link for the indicator animation.
  const [selectedIndicator, setSelectedIndicator] = useState(location.pathname);

  /**
   * Handles the user logout process.
   */
  const handleLogout = () => {
    logout();
    toast.success('You have been logged out.');
    navigate('/');
  };

  // Dynamically construct the final list of navigation items.
  const navItems = [
    ...baseNavItems,
    user
      ? { title: 'Logout', href: '#logout', action: handleLogout } // If logged in, show Logout.
      : { title: 'Login / Register', href: '/login' }, // Otherwise, show Login.
  ];

  return (
    <motion.div
      variants={menuSlide}
      initial="initial"
      animate="enter"
      exit="exit"
      className={styles.menu}
    >
      <div className={styles.body}>
        {/* Reset indicator on mouse leave to highlight the active page link. */}
        <div onMouseLeave={() => setSelectedIndicator(location.pathname)} className={styles.nav}>
          <div className={styles.header}>
            <p>Navigation</p>
          </div>
          {navItems.map((data, index) => (
            <Link
              key={index}
              data={{ ...data, index }}
              isActive={selectedIndicator === data.href}
              setSelectedIndicator={setSelectedIndicator}
            />
          ))}
        </div>
      </div>

      {/* Link to the source code repository. */}
      <div className={styles.footer}>
        <a href="https://www.github.com/kunalmttl/adoptly" target="_blank" rel="noopener noreferrer">
          <Github size={20} />
          <span>View Source Code</span>
        </a>
      </div>

      {/* The animated SVG curve on the side of the panel. */}
      <Curve />
    </motion.div>
  );
}