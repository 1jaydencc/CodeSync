import React, { useState, useEffect } from 'react';

const NewFilePopup = ({ isOpen, onClose, onCreate }) => {
    const [fileName, setFileName] = useState('');

    // Reset fileName when the popup is opened
    useEffect(() => {
        if (isOpen) {
            setFileName('');
        }
    }, [isOpen]);

    return isOpen ? (
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
    ) : null;
};

export default NewFilePopup;