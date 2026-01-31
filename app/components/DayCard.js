'use client';

import Link from 'next/link';
import styles from './DayCard.module.css';

export default function DayCard({ day, index }) {
    const dayImages = {
        'Monday': '🌅',
        'Tuesday': '🌞',
        'Wednesday': '☀️',
        'Thursday': '🌤️',
        'Friday': '🌆',
        'Saturday': '🌇',
        'Sunday': '🌃'
    };

    return (
        <Link href={`/day/${day.id}`} className={styles.card}>
            <div className={styles.imageWrapper}>
                <div className={styles.imagePlaceholder}>
                    <span className={styles.dayIcon}>{dayImages[day.name] || '🍽️'}</span>
                </div>
            </div>
            <div className={styles.content}>
                <h3 className={styles.dayName}>{day.name}</h3>
                <p className={styles.subtitle}>View Menu</p>
            </div>
        </Link>
    );
}
