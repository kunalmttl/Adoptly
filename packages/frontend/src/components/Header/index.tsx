// src/components/Header/index.tsx
'use client';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Burger from './Burger';
import Nav from './Nav'; // We will create this next
import MagneticButton from './MagneticButton'; 


interface HeaderProps {
    textColorClass?: string;
}

export default function Header({ textColorClass }: HeaderProps) {  
    const [isActive, setIsActive] = useState(false);

    return (
        <div className='relative' >
            <MagneticButton isActive={isActive}>
                <Burger isActive={isActive} setIsActive={setIsActive} textColorClass={textColorClass} />
            </MagneticButton>
            <AnimatePresence mode="wait">
                {isActive && <Nav />}
            </AnimatePresence>
        </div>
    )
}