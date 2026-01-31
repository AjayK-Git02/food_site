'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FoodCard from '../../components/FoodCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getFoodsByDay, getDay } from '../../lib/supabase';
import styles from './page.module.css';

const TIME_SLOTS = ['morning', 'snacks', 'evening', 'dinner'];
const TIME_SLOT_LABELS = {
    morning: 'Morning',
    snacks: 'Snacks',
    evening: 'Evening',
    dinner: 'Dinner'
};

export default function DayMenuPage() {
    const params = useParams();
    const router = useRouter();
    const [foods, setFoods] = useState([]);
    const [filteredFoods, setFilteredFoods] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [loading, setLoading] = useState(true);
    const [dayName, setDayName] = useState('');

    useEffect(() => {
        loadFoods();
    }, [params.id]);

    useEffect(() => {
        filterFoods();
    }, [activeTab, foods]);

    async function loadFoods() {
        try {
            // Fetch day details
            const dayData = await getDay(params.id);
            if (dayData) {
                setDayName(dayData.name);
            }

            // Fetch foods
            const data = await getFoodsByDay(params.id);
            setFoods(data);
            setLoading(false);
        } catch (error) {
            console.error('Error loading foods:', error);
            setLoading(false);
        }
    }

    function filterFoods() {
        if (activeTab === 'all') {
            setFilteredFoods(foods);
        } else {
            setFilteredFoods(foods.filter(food => food.time_slot === activeTab));
        }
    }

    function handleTabClick(tab) {
        setActiveTab(tab);
    }

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className={styles.dayMenuPage}>
            <div className="container">
                {/* Page Header */}
                <div className={styles.pageHeader}>
                    <button
                        onClick={() => router.back()}
                        className={`btn btn-outline ${styles.backBtn}`}
                    >
                        ← Back
                    </button>
                    <h1 className={styles.pageTitle}>{dayName}'s Menu</h1>
                </div>

                {/* Filter Tabs */}
                <div className={`tabs ${styles.filterTabs}`}>
                    <button
                        className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => handleTabClick('all')}
                    >
                        All
                    </button>
                    {TIME_SLOTS.map(slot => (
                        <button
                            key={slot}
                            className={`tab ${activeTab === slot ? 'active' : ''}`}
                            onClick={() => handleTabClick(slot)}
                        >
                            {TIME_SLOT_LABELS[slot]}
                        </button>
                    ))}
                </div>

                {/* Food Cards Grid */}
                {filteredFoods.length > 0 ? (
                    <div className="grid-responsive">
                        {filteredFoods.map((food, index) => (
                            <div
                                key={food.id}
                                className="animate-fadeInUp"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <FoodCard food={food} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">🍽️</div>
                        <h3>No food available</h3>
                        <p>Check back later or try a different time slot</p>
                    </div>
                )}
            </div>
        </div>
    );
}
