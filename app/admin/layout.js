'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import AdminSidebar from '../components/AdminSidebar';
import styles from './layout.module.css';

export default function AdminLayout({ children }) {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check actual Supabase session
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session && !window.location.pathname.includes('/admin/login')) {
                router.push('/admin/login');
            } else if (session) {
                setIsAuthenticated(true);
            }
        };

        checkAuth();

        // Listen for auth changes (logout/login)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (!session && !window.location.pathname.includes('/admin/login')) {
                router.push('/admin/login');
                setIsAuthenticated(false);
            } else if (session) {
                setIsAuthenticated(true);
            }
        });

        return () => subscription.unsubscribe();
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
