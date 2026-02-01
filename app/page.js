'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DayCard from './components/DayCard';
import WhatsAppButton from './components/WhatsAppButton';
import LoadingSpinner from './components/LoadingSpinner';
import { getDays, getSettings } from './lib/supabase';
import styles from './page.module.css';

export default function HomePage() {
    const [days, setDays] = useState([]);
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
            const [daysData, settingsData] = await Promise.all([
                getDays(),
                getSettings()
            ]);
            setDays(daysData);
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
                        {[
                            {
                                id: 's1',
                                name: 'Hyderabadi Biryani',
                                price: 250,
                                image_url: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80',
                                available: true
                            },
                            {
                                id: 's2',
                                name: 'Cheese Cake',
                                price: 150,
                                image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', // Reusing dummy for now or different
                                available: true
                            },
                            {
                                id: 's3',
                                name: 'Special Thali',
                                price: 300,
                                image_url: 'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?auto=format&fit=crop&w=800&q=80',
                                available: true
                            }
                        ].map(food => (
                            <Link href={`/food/${food.id}`} key={food.id} className={styles.specialSlideItem}>
                                <div className={styles.specialImageWrapper}>
                                    <img src={food.image_url} alt={food.name} loading="lazy" />
                                </div>
                                <div className={styles.specialContent}>
                                    <h3>{food.name}</h3>
                                    <span className="badge badge-primary">₹{food.price}</span>
                                </div>
                            </Link>
                        ))}
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
