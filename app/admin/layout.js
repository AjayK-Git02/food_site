'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../components/AdminSidebar';
import styles from './layout.module.css';

export default function AdminLayout({ children }) {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check authentication
        const authStatus = localStorage.getItem('isAdminAuthenticated');
        if (!authStatus && !window.location.pathname.includes('/admin/login')) {
            router.push('/admin/login');
        } else {
            setIsAuthenticated(true);
        }
    }, []);

    // Don't show sidebar on login page
    if (!isAuthenticated || window.location.pathname.includes('/admin/login')) {
        return <>{children}</>;
    }

    return (
        <div className={styles.adminLayout}>
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className={styles.mainContent}>
                <button
                    className={styles.menuBtn}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    ☰ Menu
                </button>
                {children}
            </div>
        </div>
    );
}
