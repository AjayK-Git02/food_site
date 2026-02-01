'use client';

import { getWhatsAppUrl, generateWhatsAppMessage } from '../lib/utils';
import { getSettings } from '../lib/supabase';
import { useState, useEffect } from 'react';
import styles from './WhatsAppButton.module.css';

export default function WhatsAppButton({ phoneNumber }) {
    const [isMobile, setIsMobile] = useState(false);
    const [whatsappNumber, setWhatsappNumber] = useState(phoneNumber || '918102110031');

    useEffect(() => {
        setIsMobile(window.innerWidth <= 768);

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!phoneNumber) {
            loadWhatsAppNumber();
        }
    }, [phoneNumber]);

    async function loadWhatsAppNumber() {
        try {
            const settings = await getSettings();
            if (settings && settings.whatsapp_number) {
                setWhatsappNumber(settings.whatsapp_number);
            }
        } catch (error) {
            console.error('Error loading WhatsApp number:', error);
        }
    }

    const handleClick = () => {
        const message = generateWhatsAppMessage('menu', 'today', '');
        const url = getWhatsAppUrl(whatsappNumber, message);
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
