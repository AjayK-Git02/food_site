'use client';

import { useState, useEffect } from 'react';
import { deleteFood, getAllFoods, updateFood, uploadFoodImage, getDays } from '../../lib/supabase';
import { formatCurrency } from '../../lib/utils';
import ConfirmDialog from '../../components/ConfirmDialog';
import styles from './page.module.css';

export default function ManageMenuPage() {
    const [foods, setFoods] = useState([]);
    const [days, setDays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, foodId: null, foodName: '' });
    const [editDialog, setEditDialog] = useState({
        isOpen: false,
        food: null,
        loading: false
    });
    const [editFormData, setEditFormData] = useState({
        name: '',
        day_id: '',
        time_slot: 'morning',
        price: '',
        description: '',
        ingredients: '',
        ingredients: '',
        available: true,
        is_special: false
    });
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const [foodsData, daysData] = await Promise.all([
                getAllFoods(),
                getDays()
            ]);
            setFoods(foodsData);
            setDays(daysData);
            setLoading(false);
        } catch (error) {
            console.error('Error loading data:', error);
            setLoading(false);
        }
    }

    function handleEdit(foodId) {
        const food = foods.find(f => f.id === foodId);
        if (!food) return;

        setEditFormData({
            name: food.name,
            day_id: food.day_id,
            time_slot: food.time_slot || 'morning',
            price: food.price,
            description: food.description || '',
            ingredients: Array.isArray(food.ingredients) ? food.ingredients.join(', ') : '',
            ingredients: Array.isArray(food.ingredients) ? food.ingredients.join(', ') : '',
            available: food.available,
            is_special: food.is_special || false
        });
        setImageFile(null);
        setEditDialog({ isOpen: true, food, loading: false });
    }

    function closeEditDialog() {
        setEditDialog({ isOpen: false, food: null, loading: false });
        setEditFormData({
            name: '',
            day_id: '',
            time_slot: 'morning',
            price: '',
            description: '',
            ingredients: '',
            ingredients: '',
            available: true,
            is_special: false
        });
        setImageFile(null);
    }

    function handleEditFormChange(e) {
        const { name, value, type, checked } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    }

    function handleImageChange(e) {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
        }
    }

    async function handleUpdate(e) {
        e.preventDefault();
        setEditDialog(prev => ({ ...prev, loading: true }));

        try {
            let imageUrl = editDialog.food.image_url;

            // Upload new image if selected
            if (imageFile) {
                imageUrl = await uploadFoodImage(imageFile);
            }

            const ingredientsArray = editFormData.ingredients
                .split(',')
                .map(i => i.trim())
                .filter(i => i);

            const updateData = {
                ...editFormData,
                ingredients: ingredientsArray,
                image_url: imageUrl,
                price: parseFloat(editFormData.price)
            };

            await updateFood(editDialog.food.id, updateData);

            // Update local state
            setFoods(foods.map(food =>
                food.id === editDialog.food.id
                    ? { ...food, ...updateData, day: days.find(d => d.id === updateData.day_id)?.name }
                    : food
            ));

            closeEditDialog();
        } catch (error) {
            console.error('Error updating food:', error);
            alert('Failed to update food: ' + error.message);
            setEditDialog(prev => ({ ...prev, loading: false }));
        }
    }

    function openDeleteDialog(food) {
        setDeleteDialog({ isOpen: true, foodId: food.id, foodName: food.name });
    }

    function closeDeleteDialog() {
        setDeleteDialog({ isOpen: false, foodId: null, foodName: '' });
    }

    async function handleDelete() {
        try {
            await deleteFood(deleteDialog.foodId);
            setFoods(foods.filter(f => f.id !== deleteDialog.foodId));
            closeDeleteDialog();
        } catch (error) {
            alert('Failed to delete food');
        }
    }

    if (loading) {
        return <div className="spinner"></div>;
    }

    return (
        <div className={styles.manageMenuPage}>
            <h1 className={styles.pageTitle}>Manage Weekly Menu</h1>

            <div className={`card ${styles.tableWrapper}`}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Food Name</th>
                            <th>Day</th>
                            <th>Time Slot</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {foods.map(food => (
                            <tr key={food.id}>
                                <td className={styles.foodName}>{food.name}</td>
                                <td>{food.day}</td>
                                <td className={styles.timeSlot}>{food.time_slot}</td>
                                <td className={styles.price}>{formatCurrency(food.price)}</td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <span className={`badge ${food.available ? 'badge-success' : 'badge-error'}`}>
                                            {food.available ? 'Available' : 'Sold Out'}
                                        </span>
                                        {food.is_special && (
                                            <span className="badge badge-primary">✨ Special</span>
                                        )}
                                    </div>
                                </td>
                                <td className={styles.actions}>
                                    <button
                                        className={`btn btn-outline ${styles.editBtn}`}
                                        onClick={() => handleEdit(food.id)}
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        className={`btn ${styles.deleteBtn}`}
                                        onClick={() => openDeleteDialog(food)}
                                        style={{ background: 'var(--error)', color: 'white' }}
                                    >
                                        🗑️ Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {foods.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-state-icon">🍽️</div>
                        <h3>No foods found</h3>
                        <p>Start by adding some delicious dishes</p>
                    </div>
                )}
            </div>

            {/* Edit Dialog */}
            {editDialog.isOpen && (
                <div className="modal-overlay" onClick={closeEditDialog}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', maxHeight: '90vh', overflow: 'auto' }}>
                        <h2>Edit Food Item</h2>
                        <form onSubmit={handleUpdate}>
                            <div className="form-group">
                                <label htmlFor="edit_name">Food Name *</label>
                                <input
                                    type="text"
                                    id="edit_name"
                                    name="name"
                                    className="input"
                                    value={editFormData.name}
                                    onChange={handleEditFormChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="edit_day">Day *</label>
                                <select
                                    id="edit_day"
                                    name="day_id"
                                    className="input"
                                    value={editFormData.day_id}
                                    onChange={handleEditFormChange}
                                    required
                                >
                                    <option value="">Select a day</option>
                                    {days.map(day => (
                                        <option key={day.id} value={day.id}>{day.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="edit_time_slot">Time Slot *</label>
                                <select
                                    id="edit_time_slot"
                                    name="time_slot"
                                    className="input"
                                    value={editFormData.time_slot}
                                    onChange={handleEditFormChange}
                                    required
                                >
                                    <option value="morning">Morning</option>
                                    <option value="snacks">Snacks</option>
                                    <option value="evening">Evening</option>
                                    <option value="dinner">Dinner</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="edit_price">Price (₹) *</label>
                                <input
                                    type="number"
                                    id="edit_price"
                                    name="price"
                                    className="input"
                                    value={editFormData.price}
                                    onChange={handleEditFormChange}
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="edit_description">Description</label>
                                <textarea
                                    id="edit_description"
                                    name="description"
                                    className="input"
                                    value={editFormData.description}
                                    onChange={handleEditFormChange}
                                    rows="3"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="edit_ingredients">Ingredients (comma-separated)</label>
                                <textarea
                                    id="edit_ingredients"
                                    name="ingredients"
                                    className="input"
                                    value={editFormData.ingredients}
                                    onChange={handleEditFormChange}
                                    rows="2"
                                    placeholder="e.g., Rice, Lentils, Spices"
                                />
                            </div>



                            <div className="form-group">
                                <label htmlFor="edit_image">Change Image (optional)</label>
                                <input
                                    type="file"
                                    id="edit_image"
                                    className="input"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                                {editDialog.food.image_url && !imageFile && (
                                    <img
                                        src={editDialog.food.image_url}
                                        alt="Current"
                                        style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px', borderRadius: '8px' }}
                                    />
                                )}
                            </div>

                            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <input
                                        type="checkbox"
                                        id="edit_available"
                                        name="available"
                                        checked={editFormData.available}
                                        onChange={handleEditFormChange}
                                        style={{ width: '20px', height: '20px' }}
                                    />
                                    <label htmlFor="edit_available" style={{ margin: 0 }}>Available</label>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <input
                                        type="checkbox"
                                        id="edit_is_special"
                                        name="is_special"
                                        checked={editFormData.is_special || false}
                                        onChange={handleEditFormChange}
                                        style={{ width: '20px', height: '20px' }}
                                    />
                                    <label htmlFor="edit_is_special" style={{ margin: 0 }}>✨ Special</label>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={editDialog.loading}
                                    style={{ flex: 1 }}
                                >
                                    {editDialog.loading ? 'Updating...' : '💾 Update Food'}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={closeEditDialog}
                                    disabled={editDialog.loading}
                                    style={{ flex: 1 }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmDialog
                isOpen={deleteDialog.isOpen}
                title="Delete Food Item"
                message={`Are you sure you want to delete "${deleteDialog.foodName}"? This action cannot be undone.`}
                onConfirm={handleDelete}
                onCancel={closeDeleteDialog}
            />
        </div>
    );
}
