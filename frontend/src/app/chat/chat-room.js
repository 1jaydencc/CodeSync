// @/app/Chat/ChatRoom
"use client";
import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "@/firebase-config"; // make sure these imports are correct
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import "@/app/chat/chat-room.css";
import { onAuthStateChanged } from "firebase/auth";
import Image from "next/image";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserUid, setCurrentUserUid] = useState(null);
  const messagesEndRef = useRef(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedGithubUsername, setSelectedGithubUsername] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownVisible &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownVisible(false);
      }
    };

    // Add when the dropdown is visible and remove when it's not
    if (dropdownVisible) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownVisible]);

  useEffect(() => {
    console.log("User:", auth.currentUser);
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUserUid(user?.uid);
    });

    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messages);
    });

    return () => {
      unsubscribe();
      unsubscribeAuth && unsubscribeAuth();
    };
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const githubUsername = auth.currentUser.reloadUserInfo.screenName;

    await addDoc(collection(db, "messages"), {
      text: newMessage,
      createdAt: new Date(),
      uid: currentUserUid,
      displayName:
        auth.currentUser?.displayName || auth.currentUser?.email || "Anonymous",
      photoURL: auth.currentUser?.photoURL,
      githubUsername, // Store this for each message for later use
    });
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    setNewMessage("");
  };

  const dropdownRef = useRef(null);

  const handleProfilePictureClick = (githubUsername, event) => {
    event.preventDefault(); // Prevent default to avoid any unwanted behavior
    const bounds = event.target.getBoundingClientRect();
    setDropdownPosition({
      x: bounds.left, // Or any logic to position based on your UI needs
      y: bounds.top + bounds.height, // Position below the image
    });
    setSelectedGithubUsername(githubUsername);
    setDropdownVisible(true);
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((msg, index) => {
          // Determine if we should show the display name (when it's the first message or the user has changed)
          const showDisplayName =
            index === 0 || messages[index - 1].uid !== msg.uid;

          return (
            <div
              key={msg.id}
              className={`message-wrapper ${msg.uid === currentUserUid ? "sent-wrapper" : "received-wrapper"}`}
            >
              {showDisplayName && (
                <div className="message-header">
                  <Image
                    src={msg.photoURL || faUser}
                    alt="Profile"
                    onClick={(e) =>
                      handleProfilePictureClick(msg.githubUsername, e)
                    }
                    width={30}
                    height={30}
                    style={{
                      cursor: "pointer",
                      borderRadius: "50%",
                      marginRight: "0px",
                    }}
                    draggable="false"
                  />
                  {msg.displayName || "Anonymous"}
                </div>
              )}
              <div
                className={`message ${msg.uid === currentUserUid ? "sent" : "received"}`}
              >
                <div className="message-content">{msg.text}</div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>
      {dropdownVisible && (
        <div
          ref={dropdownRef}
          className="dropdown-menu dropdown custom-dropdown"
          style={{
            position: "absolute",
            top: dropdownPosition.y,
            left: dropdownPosition.x,
          }}
        >
          <ul
            tabIndex="-1"
            className="menu bg-base-100 rounded-box w-32 p-2 text-xs text-white shadow"
          >
            <li>
              <a
                href={`https://github.com/${selectedGithubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2"
              >
                View GitHub Profile
              </a>
            </li>
          </ul>
        </div>
      )}

      <form onSubmit={sendMessage} className="message-form">
        <input
          type="text"
          placeholder="Type a message..."
          className="message-input"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
