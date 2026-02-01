'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getSettings } from '../lib/supabase';
import styles from './Header.module.css';

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [kitchenName, setKitchenName] = useState('Cloud Kitchen');

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
                setKitchenName(settings.kitchen_name);
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
                        <span className={styles.logoIcon}>🍽️</span>
                    </Link>

                    {/* Kitchen Name */}
                    <Link href="/" className={styles.brandName}>
                        <h1>{kitchenName}</h1>
                    </Link>

                    {/* Admin Login Button */}
                    <Link href="/admin/login" className="btn btn-primary">
                        Admin Login
                    </Link>
                </div>
            </div>
        </header>
    );
}
