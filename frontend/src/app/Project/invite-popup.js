'use client';
import React, { useState, useEffect } from 'react';
import '@/app/editor/editor.css';

export const invitePopup = ({ isOpen, onClose, onSend }) => {
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (isOpen) {
            setEmail('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="popup-overlay"> {/* This div acts as the overlay */}
            <div className="popup">
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email"
                />
                <button onClick={() => onSend(email)}>Invite</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};
