'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '../../lib/supabase';
import styles from './page.module.css';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signIn(email, password);
            router.push('/admin/dashboard');
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
            setLoading(false);
        }
    }

    return (
        <div className={styles.loginPage}>
            <div className={`card ${styles.loginCard} animate-scaleIn`}>
                <div className={styles.logoSection}>
                    <span className={styles.logo}>🔐</span>
                    <h1>Admin Login</h1>
                    <p>Enter your credentials to access the admin panel</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.loginForm}>
                    <div>
                        <label htmlFor="email" className="label">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="input"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="label">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="input"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div className={styles.error}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <div className={styles.securityNote}>
                        <p><small>🔒 Secure simplified login</small></p>
                    </div>
                </form>
            </div>
        </div>
    );
}
