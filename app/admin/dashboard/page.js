'use client';

import { useState, useEffect } from 'react';
import { getAllFoods, getDays } from '../../lib/supabase';
import styles from './page.module.css';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalFoods: 0,
        availableFoods: 0,
        soldOutFoods: 0,
        daysActive: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    async function loadStats() {
        try {
            const [foods, days] = await Promise.all([
                getAllFoods(),
                getDays()
            ]);

            setStats({
                totalFoods: foods.length,
                availableFoods: foods.filter(f => f.available).length,
                soldOutFoods: foods.filter(f => !f.available).length,
                daysActive: days.length
            });
            setLoading(false);
        } catch (error) {
            console.error('Error loading stats:', error);
            setLoading(false);
        }
    }

    if (loading) {
        return <div className="spinner"></div>;
    }

    return (
        <div className={styles.dashboard}>
            <h1 className={styles.pageTitle}>Dashboard</h1>

            <div className={styles.statsGrid}>
                <div className={`card ${styles.statCard}`}>
                    <div className={styles.statIcon}>🍽️</div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Total Foods</p>
                        <h2 className={styles.statValue}>{stats.totalFoods}</h2>
                    </div>
                </div>

                <div className={`card ${styles.statCard}`}>
                    <div className={styles.statIcon}>✓</div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Available</p>
                        <h2 className={styles.statValue}>{stats.availableFoods}</h2>
                    </div>
                </div>

                <div className={`card ${styles.statCard}`}>
                    <div className={styles.statIcon}>✗</div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Sold Out</p>
                        <h2 className={styles.statValue}>{stats.soldOutFoods}</h2>
                    </div>
                </div>

                <div className={`card ${styles.statCard}`}>
                    <div className={styles.statIcon}>📅</div>
                    <div className={styles.statContent}>
                        <p className={styles.statLabel}>Days Active</p>
                        <h2 className={styles.statValue}>{stats.daysActive}</h2>
                    </div>
                </div>
            </div>

            <div className={styles.welcomeCard}>
                <h2>Welcome to Cloud Kitchen Admin! 👋</h2>
                <p>Manage your weekly menu, add new dishes, and update site settings from this panel.</p>

                <div className={styles.quickActions}>
                    <a href="/admin/add-food" className="btn btn-primary">
                        ➕ Add New Food
                    </a>
                    <a href="/admin/manage-menu" className="btn btn-outline">
                        📅 Manage Menu
                    </a>
                </div>
            </div>
        </div>
    );
}
