'use client';
import React from 'react';

const Taskbar = ({ onNewFile, onSaveFile, onOpenFile, onRun, onDebug, onTerminal, onHelp, onDownloadAllFiles, onChat, }) => {
    return (
        <div className="taskbar">
            <button onClick={onNewFile}>New File</button>
            <button onClick={onSaveFile}>Save</button>
            <button onClick={onOpenFile}>Open File</button>
            <button onClick={onRun}>Run</button>
            <button onClick={onDebug}>Debug</button>
            <button onClick={onTerminal}>Terminal</button>
            <button onClick={onTheme}>Theme</button>
            <button onClick={onHelp}>Help</button>
            <button onClick={onDownloadAllFiles}>Download</button>
            <button onClick={onChat}>Chat</button>
        </div>
    );
};

export default Taskbar;
/*
import React, { useState, useRef, useEffect } from 'react';

const Taskbar = ({ onNewFile, onOpenFile, onSaveFile, onRun, onDebug, onCreateTerminal }) => {
    const [showFileMenu, setShowFileMenu] = useState(false);
    const [showRunMenu, setShowRunMenu] = useState(false);
    const [showTerminalMenu, setShowTerminalMenu] = useState(false);
    const taskbarRef = useRef();

    const handleFileMenu = () => setShowFileMenu(!showFileMenu);
    const handleRunMenu = () => setShowRunMenu(!showRunMenu);
    const handleTerminalMenu = () => setShowTerminalMenu(!showTerminalMenu);

    const handleClickOutside = (event) => {
        if (taskbarRef.current && !taskbarRef.current.contains(event.target)) {
            setShowFileMenu(false);
            setShowRunMenu(false);
            setShowTerminalMenu(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="taskbar">
            <div className="taskbar-item" onClick={handleFileMenu}>File</div>
            {showFileMenu && (
                <div className="taskbar-dropdown">
                    <div onClick={onNewFile}>New File</div>
                    <div onClick={onOpenFile}>Open File</div>
                    <div onClick={onSaveFile}>Save</div>
                </div>
            )}

            <div className="taskbar-item" onClick={handleRunMenu}>Run</div>
            {showRunMenu && (
                <div className="taskbar-dropdown">
                    <div onClick={onRun}>Run without Debugging</div>
                    <div onClick={onDebug}>Run with Debugging</div>
                </div>
            )}

            <div className="taskbar-item" onClick={handleTerminalMenu}>Terminal</div>
            {showTerminalMenu && (
                <div className="taskbar-dropdown">
                    <div onClick={onCreateTerminal}>New Terminal</div>
                </div>
            )}
        </div>
    );
};

export default Taskbar;
*/