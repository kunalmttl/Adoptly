// src/components/Header/index.tsx
'use client';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Burger from './Burger';
import Nav from './Nav'; // We will create this next
import MagneticButton from './MagneticButton'; 


export default function Header() {  
    const [isActive, setIsActive] = useState(false);

    return (
        <div className='relative' >
            <MagneticButton isActive={isActive}>
                <Burger isActive={isActive} setIsActive={setIsActive} />
            </MagneticButton>
            <AnimatePresence mode="wait">
                {isActive && <Nav />}
            </AnimatePresence>
        </div>
    )
}