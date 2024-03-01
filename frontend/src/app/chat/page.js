// @/app/Chat/page
"use client";
import ChatRoom from '@/app/chat/chat-room';
import '@/app/chat/chat-page.css';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';

export default function ChatPage() {
    const router = useRouter(); // Using the useRouter hook for navigation

    // Function to handle navigation back to the Code Editor
    const navigateToEditor = () => {
        router.push('/editor'); 
    };
    return (
      <div className="chat-page">
        <button onClick={navigateToEditor} className="back-to-editor-btn"> &lt; Editor</button>
        <div className="chat-header">Chat</div>
        <ChatRoom />
      </div>
    );
  }