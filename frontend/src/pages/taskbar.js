import React from 'react';

const Taskbar = ({ onNewFile, onSaveFile, onLanguageChange }) => {
    return (
        <div className="taskbar">
            <button onClick={onNewFile}>New File</button>
            <button onClick={onSaveFile}>Save</button>
            {/* Other buttons and functionalities */}
        </div>
    );
};

export default Taskbar;
