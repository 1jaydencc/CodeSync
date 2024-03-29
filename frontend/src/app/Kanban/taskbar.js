'use client';
import React from 'react';

const Taskbar = ({onHelp, onToggleNotifications}) => {
    return (
        <div className="taskbar">
            <button onClick={onHelp}>Help</button>
            <button onClick={onToggleNotifications}>Notifications</button>
        </div>
    );
};

export default Taskbar;