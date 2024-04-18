'use client';
import React from 'react';
import { useRouter } from "next/navigation";

const Taskbar = ({onHelp, onToggleNotifications}) => {
    const router = useRouter(); // Using the useRouter hook for navigation
    
    const navigateToEditor = () => {
      router.push("/editor");
    };

    return (
        <div className="taskbar">
            
            <button onClick={navigateToEditor} className="back-to-editor-btn">
            {" "}
            &lt; Editor
            </button>
        </div>
    );
};

export default Taskbar;