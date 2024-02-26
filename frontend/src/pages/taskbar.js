import React from 'react';
import './Taskbar.css';

const Taskbar = ({ onNewFile, onSaveFile, onOpenFile, onRun, onDebug, onTerminal, onHelp, }) => {
    return (
        <div className="taskbar">
            <button onClick={onNewFile}>New File</button>
            <button onClick={onSaveFile}>Save</button>
            <button onClick={onOpenFile}>Open File</button>
            <button onClick={onRun}>Run</button>
            <button onClick={onDebug}>Debug</button>
            <button onClick={onTerminal}>Terminal</button>
            <button onClick={onHelp}>Help</button>
        </div>
    );
};

export default Taskbar;
