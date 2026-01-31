'use client';

import { useState } from 'react';
import styles from './ConfirmDialog.module.css';

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.message}>{message}</p>

                <div className={styles.actions}>
                    <button className="btn btn-outline" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="btn" style={{ background: 'var(--error)', color: 'white' }} onClick={onConfirm}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
