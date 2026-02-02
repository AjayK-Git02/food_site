'use client';

import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../../lib/supabase';
import styles from './page.module.css';

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        kitchen_name: 'Cloud Kitchen',
        tagline: 'Fresh Home-Cooked Meals',
        phone: '+91 12345 67890',
        whatsapp_number: '918102110031',
        social_links: {
            facebook: '',
            instagram: '',
            twitter: ''
        },
        address: '123 Food Street, Bangalore, India',
        copyright: '© 2024 Cloud Kitchen. All rights reserved.'
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        loadSettings();
    }, []);

    async function loadSettings() {
        try {
            const data = await getSettings();
            if (data) {
                // Ensure social_links has defaults if missing
                const social_links = data.social_links || { facebook: '', instagram: '', twitter: '' };
                setSettings({ ...data, social_links });
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;

        if (name.includes('social_')) {
            const socialKey = name.replace('social_', '');
            setSettings(prev => ({
                ...prev,
                social_links: {
                    ...prev.social_links,
                    [socialKey]: value
                }
            }));
        } else {
            setSettings(prev => ({ ...prev, [name]: value }));
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await updateSettings(settings);

            setMessage({ type: 'success', text: 'Settings updated successfully!' });
            setLoading(false);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update settings' });
            setLoading(false);
        }
    }

    return (
        <div className={styles.settingsPage}>
            <h1 className={styles.pageTitle}>Site Settings</h1>

            <form onSubmit={handleSubmit} className={`card ${styles.form}`}>
                {/* Kitchen Details */}
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Kitchen Details</h3>

                    <div className={styles.formGroup}>
                        <label htmlFor="kitchen_name" className="label">Kitchen Name</label>
                        <input
                            type="text"
                            id="kitchen_name"
                            name="kitchen_name"
                            className="input"
                            value={settings.kitchen_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="tagline" className="label">Tagline</label>
                        <input
                            type="text"
                            id="tagline"
                            name="tagline"
                            className="input"
                            value={settings.tagline}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* Contact Information */}
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Contact Information</h3>

                    <div className={styles.formGroup}>
                        <label htmlFor="phone" className="label">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            className="input"
                            value={settings.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="whatsapp_number" className="label">WhatsApp Number (with country code)</label>
                        <input
                            type="text"
                            id="whatsapp_number"
                            name="whatsapp_number"
                            className="input"
                            value={settings.whatsapp_number}
                            onChange={handleChange}
                            placeholder="918102110031"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="address" className="label">Address</label>
                        <textarea
                            id="address"
                            name="address"
                            className="input textarea"
                            value={settings.address}
                            onChange={handleChange}
                            rows={3}
                            required
                        />
                    </div>
                </div>

                {/* Social Media */}
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Social Media Links</h3>

                    <div className={styles.formGroup}>
                        <label htmlFor="social_facebook" className="label">Facebook</label>
                        <input
                            type="url"
                            id="social_facebook"
                            name="social_facebook"
                            className="input"
                            value={settings.social_links?.facebook || ''}
                            onChange={handleChange}
                            placeholder="https://facebook.com/yourpage"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="social_instagram" className="label">Instagram</label>
                        <input
                            type="url"
                            id="social_instagram"
                            name="social_instagram"
                            className="input"
                            value={settings.social_links?.instagram || ''}
                            onChange={handleChange}
                            placeholder="https://instagram.com/yourpage"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="social_twitter" className="label">Twitter</label>
                        <input
                            type="url"
                            id="social_twitter"
                            name="social_twitter"
                            className="input"
                            value={settings.social_links?.twitter || ''}
                            onChange={handleChange}
                            placeholder="https://twitter.com/yourpage"
                        />
                    </div>
                </div>

                {/* Pages Content */}
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Page Content</h3>
                    <p className="text-secondary mb-md"><small>Use HTML for formatting (e.g., &lt;p&gt;, &lt;br&gt;, &lt;strong&gt;)</small></p>

                    <div className={styles.formGroup}>
                        <label htmlFor="about_content" className="label">About Us Page</label>
                        <textarea
                            id="about_content"
                            name="about_content"
                            className="input textarea"
                            value={settings.about_content || ''}
                            onChange={handleChange}
                            rows={5}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="contact_content" className="label">Contact Page (Intro Text)</label>
                        <textarea
                            id="contact_content"
                            name="contact_content"
                            className="input textarea"
                            value={settings.contact_content || ''}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="legal_info" className="label">Legal Information</label>
                        <textarea
                            id="legal_info"
                            name="legal_info"
                            className="input textarea"
                            value={settings.legal_info || ''}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="privacy_policy" className="label">Privacy Policy</label>
                        <textarea
                            id="privacy_policy"
                            name="privacy_policy"
                            className="input textarea"
                            value={settings.privacy_policy || ''}
                            onChange={handleChange}
                            rows={5}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="terms_of_service" className="label">Terms of Service</label>
                        <textarea
                            id="terms_of_service"
                            name="terms_of_service"
                            className="input textarea"
                            value={settings.terms_of_service || ''}
                            onChange={handleChange}
                            rows={5}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="refund_policy" className="label">Refund Policy</label>
                        <textarea
                            id="refund_policy"
                            name="refund_policy"
                            className="input textarea"
                            value={settings.refund_policy || ''}
                            onChange={handleChange}
                            rows={5}
                        />
                    </div>
                </div>

                {/* Copyright */}
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Footer</h3>

                    <div className={styles.formGroup}>
                        <label htmlFor="copyright" className="label">Copyright Text</label>
                        <input
                            type="text"
                            id="copyright"
                            name="copyright"
                            className="input"
                            value={settings.copyright}
                            onChange={handleChange}
                            required
                        />
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
                    {loading ? 'Saving...' : '💾 Save Settings'}
                </button>
            </form>
        </div>
    );
}
