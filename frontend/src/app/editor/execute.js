'use client';
import React, { useState, useEffect } from 'react';
import './editor.css';

export const output = ({ onClose }) => {
    const [fileName, setFileName] = useState('');

    return (
        <div className="popup-overlay"> {/* This div acts as the overlay */}
            <div className="popup">
                <div>{content}</div>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};