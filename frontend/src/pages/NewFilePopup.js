import React, { useState, useEffect } from 'react';
import './App.css';

const NewFilePopup = ({ isOpen, onClose, onCreate }) => {
    const [fileName, setFileName] = useState('');

    useEffect(() => {
        if (isOpen) {
            setFileName('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="popup-overlay"> {/* This div acts as the overlay */}
            <div className="popup">
                <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="File name"
                />
                <button onClick={() => onCreate(fileName)}>Create</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default NewFilePopup;