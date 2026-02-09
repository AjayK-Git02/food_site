'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from '../lib/supabase';
import styles from './AdminSidebar.module.css';

export default function AdminSidebar({ isOpen, onClose }) {
    const router = useRouter();
    const pathname = usePathname();

    const menuItems = [
        { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
        { path: '/admin/add-food', icon: '➕', label: 'Add Food' },
        { path: '/admin/manage-menu', icon: '📅', label: 'Manage Menu' },
        { path: '/admin/settings', icon: '⚙️', label: 'Settings' },
    ];

    async function handleLogout() {
        await signOut();
        router.push('/admin/login');
    }

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div className={styles.overlay} onClick={onClose}></div>
            )}

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <div className={styles.sidebarHeader}>
                    <h2>Admin Panel</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        ✕
                    </button>
                </div>

                <nav className={styles.nav}>
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`${styles.navItem} ${pathname === item.path ? styles.active : ''}`}
                            onClick={onClose}
                        >
                            <span className={styles.icon}>{item.icon}</span>
                            <span className={styles.label}>{item.label}</span>
                        </Link>
                    ))}

                    <div className={styles.divider}></div>

                    <Link href="/" className={styles.navItem} onClick={onClose}>
                        <span className={styles.icon}>🏠</span>
                        <span className={styles.label}>Back to Website</span>
                    </Link>

                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        <span className={styles.icon}>🚪</span>
                        <span className={styles.label}>Logout</span>
                    </button>
                </nav>
            </aside>
        </>
    );
}
