// @/app/Chat/page
"use client";
import ChatRoom from '@/app/Chat/ChatRoom';
import './ChatPage.css';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';

export default function ChatPage() {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 gap-4">
        <div className="text-2xl font-bold">Chat Room</div>
        <ChatRoom />
      </div>
    );
  }