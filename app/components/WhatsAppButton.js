'use client';

import { getWhatsAppUrl, generateWhatsAppMessage } from '../lib/utils';
import { useState, useEffect } from 'react';
import styles from './WhatsAppButton.module.css';

export default function WhatsAppButton({ phoneNumber = '918102110031' }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth <= 768);

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleClick = () => {
        const message = generateWhatsAppMessage('menu', 'today', '');
        const url = getWhatsAppUrl(phoneNumber, message);
        window.open(url, '_blank');
    };

    return (
        <button
            onClick={handleClick}
            className={`${styles.whatsappBtn} ${isMobile ? styles.sticky : ''} animate-pulse`}
            aria-label="Order via WhatsApp"
        >
            <span className={styles.icon}>💬</span>
            <span className={styles.text}>Order via WhatsApp</span>
        </button>
    );
}
