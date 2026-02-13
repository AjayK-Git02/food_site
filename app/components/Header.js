'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getSettings } from '../lib/supabase';
import styles from './Header.module.css';

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [kitchenName, setKitchenName] = useState('15 Spices');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        loadSettings();
    }, []);

    async function loadSettings() {
        try {
            const settings = await getSettings();
            if (settings) {
                setKitchenName(settings.kitchen_name || '15 Spices');
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    return (
        <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
            <div className="container">
                <div className={styles.headerContent}>
                    {/* Logo */}
                    <Link href="/" className={styles.logo}>
                        <Image
                            src="/logo.jpeg"
                            alt="15 Spices Logo"
                            width={60}
                            height={60}
                            className={styles.logoImage}
                            priority
                        />
                    </Link>

                    {/* Kitchen Name */}
                    <Link href="/" className={styles.brandName}>
                        <h1>{kitchenName}</h1>
                    </Link>

                    {/* Admin Login Button Removed from Header */}
                </div>
            </div>
        </header>
    );
}
