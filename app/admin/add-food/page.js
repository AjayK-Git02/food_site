'use client';

import { useState, useEffect } from 'react';
import { addFood, uploadFoodImage, getDays } from '../../lib/supabase';
import styles from './page.module.css';

const TIME_SLOTS = ['morning', 'snacks', 'evening', 'dinner'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function AddFoodPage() {
    const [formData, setFormData] = useState({
        name: '',
        day: '',
        time_slot: '',
        price: '',
        description: '',
        ingredients: '',
        ingredients: '',
        available: true,
        is_special: false
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [days, setDays] = useState([]);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Load days on mount
    useEffect(() => {
        getDays().then(setDays).catch(console.error);
    }, []);

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    }

    function handleImageChange(e) {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // For demo, just show success message
            setMessage({ type: 'success', text: 'Food added successfully!' });

            // Reset form
            setFormData({
                name: '',
                day: '',
                time_slot: '',
                price: '',
                description: '',
                ingredients: '',
                available: true,
            });
            setImageFile(null);
            setImagePreview('');

            let imageUrl = '';
            if (imageFile) {
                imageUrl = await uploadFoodImage(imageFile);
            }
            const ingredientsArray = formData.ingredients.split(',').map(i => i.trim());

            // Map 'day' from form to 'day_id' for DB
            const foodData = {
                ...formData,
                day_id: formData.day,
                ingredients: ingredientsArray,
                image_url: imageUrl
            };
            // remove original 'day' key to avoid error if strict
            delete foodData.day;

            await addFood(foodData);

            setLoading(false);
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to add food' });
            setLoading(false);
        }
    }

    return (
        <div className={styles.addFoodPage}>
            <h1 className={styles.pageTitle}>Add New Food</h1>

            <form onSubmit={handleSubmit} className={`card ${styles.form}`}>
                <div className={styles.formGrid}>
                    {/* Day Dropdown */}
                    <div>
                        <label htmlFor="day" className="label">Day *</label>
                        <select
                            id="day"
                            name="day"
                            className="input"
                            value={formData.day}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Day</option>
                            {days.map(day => (
                                <option key={day.id} value={day.id}>{day.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Time Slot Dropdown */}
                    <div>
                        <label htmlFor="time_slot" className="label">Time Slot *</label>
                        <select
                            id="time_slot"
                            name="time_slot"
                            className="input"
                            value={formData.time_slot}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Time Slot</option>
                            {TIME_SLOTS.map(slot => (
                                <option key={slot} value={slot}>
                                    {slot.charAt(0).toUpperCase() + slot.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Food Name */}
                    <div>
                        <label htmlFor="name" className="label">Food Name *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="input"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g., Masala Dosa"
                            required
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label htmlFor="price" className="label">Price (₹) *</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            className="input"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="e.g., 80"
                            step="0.01"
                            min="0"
                            required
                        />
                    </div>
                </div>

                {/* Image Upload */}
                <div>
                    <label htmlFor="image" className="label">Food Image</label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="input"
                    />
                    {imagePreview && (
                        <div className={styles.imagePreview}>
                            <img src={imagePreview} alt="Preview" />
                        </div>
                    )}
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="label">Description *</label>
                    <textarea
                        id="description"
                        name="description"
                        className="input textarea"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe the dish..."
                        rows={4}
                        required
                    />
                </div>

                {/* Ingredients */}
                <div>
                    <label htmlFor="ingredients" className="label">Ingredients (comma-separated) *</label>
                    <textarea
                        id="ingredients"
                        name="ingredients"
                        className="input textarea"
                        value={formData.ingredients}
                        onChange={handleChange}
                        placeholder="e.g., Rice, Urad Dal, Potatoes, Onions"
                        rows={3}
                        required
                    />
                </div>

                {/* Availability Toggle */}
                <div className={styles.flexRow}>
                    <div className={styles.toggleWrapper}>
                        <label className="label">Availability</label>
                        <label className="toggle">
                            <input
                                type="checkbox"
                                name="available"
                                checked={formData.available}
                                onChange={handleChange}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                        <span className={styles.toggleLabel}>
                            {formData.available ? 'Available' : 'Not Available'}
                        </span>
                    </div>

                    <div className={styles.toggleWrapper}>
                        <label className="label">Today's Special</label>
                        <label className="toggle">
                            <input
                                type="checkbox"
                                name="is_special"
                                checked={formData.is_special || false}
                                onChange={handleChange}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                        <span className={styles.toggleLabel}>
                            {formData.is_special ? '✨ Special' : 'Regular'}
                        </span>
                    </div>
                </div>

                {/* Message */}
                {message.text && (
                    <div className={`${styles.message} ${styles[message.type]}`}>
                        {message.text}
                    </div>
                )}

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                    {loading ? 'Saving...' : '💾 Save Food'}
                </button>
            </form>
        </div>
    );
}
