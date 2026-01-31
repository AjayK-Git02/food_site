'use client';

import { usePathname } from 'next/navigation';
import Header from './components/Header';
import Footer from './components/Footer';
import './globals.css';

export default function RootLayout({ children }) {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith('/admin');

    return (
        <html lang="en">
            <head>
                <title>Cloud Kitchen - Fresh Home-Cooked Meals</title>
                <meta name="description" content="Delicious home-cooked meals delivered fresh daily. Order via WhatsApp!" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            </head>
            <body>
                {!isAdminRoute && <Header />}
                {isAdminRoute ? children : <main>{children}</main>}
                {!isAdminRoute && <Footer />}
            </body>
        </html>
    );
}
