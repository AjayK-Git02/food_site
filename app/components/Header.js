'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './Header.module.css';

export default function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
                        <h1>Cloud Kitchen</h1>
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
