'use client';
import React, { useState, useEffect } from 'react';
import './editor.css';

export const NewProjectPopup = ({ isOpen, onClose, onCreate }) => {
    const [projectName, setProjectName] = useState('');

    useEffect(() => {
        if (isOpen) {
            setProjectName('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="popup-overlay"> {/* This div acts as the overlay */}
            <div className="popup">
                <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="project name"
                />
                <button onClick={() => onCreate(projetName)}>Create</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};
