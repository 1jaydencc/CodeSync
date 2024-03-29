// @/app/Chat/page
"use client";
import ChatRoom from "@/app/chat/chat-room";
import "@/app/chat/chat-page.css";
import "@/app/editor/editor.css";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import TitleBar from "../title-bar/title-bar";

export default function ChatPage() {
  const router = useRouter(); // Using the useRouter hook for navigation

  return (
    <div className="container0">
      <TitleBar />
      <div className="container1"></div>
      <div className="chat-page">
        <button
          onClick={() => {
            router.push("/editor");
          }}
          className="back-to-editor-btn"
        >
          {" "}
          &lt; Editor
        </button>
        <div className="chat-header">Chat</div>
        <ChatRoom />
      </div>
    </div>
  );
}
