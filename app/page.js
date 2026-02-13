'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DayCard from './components/DayCard';
import WhatsAppButton from './components/WhatsAppButton';
import LoadingSpinner from './components/LoadingSpinner';
import { getDays, getSettings, getSpecialFoods } from './lib/supabase';
import styles from './page.module.css';

export default function HomePage() {
    const [days, setDays] = useState([]);
    const [specials, setSpecials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState({
        kitchen_name: 'Fresh Home-Cooked Meals',
        tagline: 'Delicious food delivered daily to your doorstep'
    });

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const [daysData, settingsData, specialsData] = await Promise.all([
                getDays(),
                getSettings(),
                getSpecialFoods()
            ]);
            setDays(daysData);
            setSpecials(specialsData || []);
            if (settingsData) {
                setSettings(settingsData);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error loading data:', error);
            setLoading(false);
        }
    }

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className={styles.homePage}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className="container">
                    <div className={styles.heroContent}>
                        <h1 className={`${styles.heroTitle} animate-fadeInDown`}>
                            {settings.kitchen_name}
                        </h1>
                        <p className={`${styles.heroSubtitle} animate-fadeInUp`}>
                            {settings.tagline}
                        </p>
                        <WhatsAppButton />
                    </div>
                </div>
            </section>

            {/* Weekly Menu Section */}
            <section className={styles.weeklyMenu} id="menu">
                <div className="container">
                    <h2 className={`${styles.sectionTitle} text-center`}>
                        Weekly Menu
                    </h2>
                    <p className={`${styles.sectionSubtitle} text-center`}>
                        Choose your day to explore today's delicious offerings
                    </p>

                    <div className={`grid-responsive ${styles.daysGrid}`}>
                        {days.map((day, index) => (
                            <div key={day.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                                <DayCard day={day} index={index} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Today's Special Section */}
            <section className={styles.specialSection}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>Today's Special</h2>
                    <p className={styles.sectionSubtitle}>
                        Featured dishes you don't want to miss!
                    </p>

                    <div className={styles.specialSlider}>
                        {specials.length > 0 ? (
                            specials.map(food => (
                                <Link href={`/food/${food.id}`} key={food.id} className={styles.specialSlideItem}>
                                    <div className={styles.specialImageWrapper}>
                                        <img src={food.image_url || 'https://via.placeholder.com/400x300?text=No+Image'} alt={food.name} loading="lazy" />
                                    </div>
                                    <div className={styles.specialContent}>
                                        <h3>{food.name}</h3>
                                        <span className="badge badge-primary">${food.price}</span>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="text-center w-full">No specials for today. Check back later!</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Sticky WhatsApp Button for mobile */}
            <div className={styles.stickyWhatsApp}>
                <WhatsAppButton />
            </div>
        </div>
    );
}
