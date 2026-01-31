'use client';

import Link from 'next/link';
import { formatCurrency } from '../lib/utils';
import styles from './FoodCard.module.css';

export default function FoodCard({ food }) {
    return (
        <Link
            href={`/food/${food.id}`}
            className={`${styles.card} ${!food.available ? styles.soldOut : ''}`}
        >
            <div className={styles.imageWrapper}>
                {food.image_url ? (
                    <img src={food.image_url} alt={food.name} />
                ) : (
                    <div className={styles.imagePlaceholder}>
                        <span className={styles.foodIcon}>🍽️</span>
                    </div>
                )}
                {!food.available && (
                    <div className={styles.soldOutOverlay}>
                        <span>Sold Out</span>
                    </div>
                )}
            </div>

            <div className={styles.content}>
                <h3 className={styles.foodName}>{food.name}</h3>

                <div className={styles.footer}>
                    <span className={`badge badge-primary ${styles.price}`}>
                        {formatCurrency(food.price)}
                    </span>
                    <span className={`badge ${food.available ? 'badge-success' : 'badge-error'}`}>
                        {food.available ? 'Available' : 'Sold Out'}
                    </span>
                </div>
            </div>
        </Link>
    );
}
