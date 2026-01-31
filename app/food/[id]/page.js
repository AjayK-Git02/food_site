'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getFood } from '../../lib/supabase';
import { formatCurrency, generateWhatsAppMessage, getWhatsAppUrl } from '../../lib/utils';
import LoadingSpinner from '../../components/LoadingSpinner';
import styles from './page.module.css';

export default function FoodDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [food, setFood] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFood();
    }, [params.id]);

    async function loadFood() {
        try {
            const data = await getFood(params.id);
            setFood(data);
            setLoading(false);
        } catch (error) {
            console.error('Error loading food:', error);
            setLoading(false);
        }
    }

    function handleWhatsAppOrder() {
        if (!food) return;

        const message = generateWhatsAppMessage(food.name, 'today', food.price);
        const url = getWhatsAppUrl('918102110031', message);
        window.open(url, '_blank');
    }

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!food) {
        return (
            <div className="container">
                <div className="empty-state">
                    <div className="empty-state-icon">🍽️</div>
                    <h3>Food not found</h3>
                    <button className="btn btn-primary" onClick={() => router.back()}>
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.foodDetailPage}>
            {/* Hero Image Section */}
            <div className={styles.heroSection}>
                {food.image_url ? (
                    <img src={food.image_url} alt={food.name} className={styles.heroImage} />
                ) : (
                    <div className={styles.heroPlaceholder}>
                        <span className={styles.foodIcon}>🍽️</span>
                    </div>
                )}
                <button
                    onClick={() => router.back()}
                    className={`btn btn-outline ${styles.backBtn}`}
                >
                    ← Back
                </button>
                <div className={styles.heroOverlay}></div>
            </div>

            {/* Food Details */}
            <div className="container">
                <div className={styles.content}>
                    {/* Info Card */}
                    <div className={`card ${styles.infoCard}`}>
                        <div className={styles.cardHeader}>
                            <h1 className={styles.foodName}>{food.name}</h1>
                            <div className={styles.badges}>
                                <span className="badge badge-primary" style={{ fontSize: '1.25rem' }}>
                                    {formatCurrency(food.price)}
                                </span>
                                <span className={`badge ${food.available ? 'badge-success' : 'badge-error'}`}>
                                    {food.available ? '✓ Available' : '✗ Sold Out'}
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className={styles.section}>
                            <h3>Description</h3>
                            <p className={styles.description}>{food.description}</p>
                        </div>

                        {/* Ingredients */}
                        <div className={styles.section}>
                            <h3>Ingredients</h3>
                            <ul className={styles.ingredientsList}>
                                {food.ingredients && food.ingredients.map((ingredient, index) => (
                                    <li key={index}>{ingredient}</li>
                                ))}
                            </ul>
                        </div>

                        {/* WhatsApp Order Button */}
                        {food.available && (
                            <button
                                onClick={handleWhatsAppOrder}
                                className="btn btn-secondary w-full"
                                style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
                            >
                                💬 Order via WhatsApp
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
