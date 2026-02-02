'use client';

import { useState, useEffect } from 'react';
import { getSettings } from '../../lib/supabase';
import { useParams, notFound } from 'next/navigation';

export default function DynamicPage() {
    const params = useParams();
    const slug = params?.slug;
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);

    const PAGE_MAP = {
        'about': { title: 'About Us', field: 'about_content' },
        'contact': { title: 'Contact Us', field: 'contact_content' },
        'privacy': { title: 'Privacy Policy', field: 'privacy_policy' },
        'terms': { title: 'Terms of Service', field: 'terms_of_service' },
        'refund': { title: 'Refund Policy', field: 'refund_policy' },
        'legal': { title: 'Legal Information', field: 'legal_info' }
    };

    useEffect(() => {
        if (!slug || !PAGE_MAP[slug]) {
            // Only redirect if slug is present but invalid, or if handled by notFound
            if (slug) notFound();
            return;
        }
        loadContent();
    }, [slug]);

    async function loadContent() {
        try {
            const settings = await getSettings();
            const config = PAGE_MAP[slug];
            if (settings && config) {
                setTitle(config.title);
                setContent(settings[config.field] || '<p>Content coming soon...</p>');
            }
        } catch (error) {
            console.error('Error loading page content:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div className="container p-xl text-center">Loading...</div>;

    return (
        <div className="container p-xl">
            <h1 className="mb-lg">{title}</h1>
            <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </div>
    );
}
