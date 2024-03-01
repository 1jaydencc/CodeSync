// @/app/Chat/ChatRoom
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '@/firebase-config'; // make sure these imports are correct
import { collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import '@/app/chat/chat-room.css';
import { onAuthStateChanged } from 'firebase/auth';

const ChatRoom = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUserUid, setCurrentUserUid] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            setCurrentUserUid(user?.uid);
        });

        const q = query(collection(db, "messages"), orderBy("createdAt"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messages = querySnapshot.docs.map(doc => ({
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

        await addDoc(collection(db, "messages"), {
            text: newMessage,
            createdAt: new Date(),
            uid: currentUserUid,
            displayName: auth.currentUser?.displayName || auth.currentUser?.email || "Anonymous",
        });
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        setNewMessage('');
    };

    return (
        <div className="chat-container">
            <div className="messages-container">
                {messages.map((msg, index) => {
                    // Determine if we should show the display name (when it's the first message or the user has changed)
                    const showDisplayName = index === 0 || messages[index - 1].uid !== msg.uid;

                    return (
                        <div key={msg.id} className={`message-wrapper ${msg.uid === currentUserUid ? 'sent-wrapper' : 'received-wrapper'}`}>
                            {showDisplayName && (
                                <div className="message-header">
                                    {msg.displayName || 'Anonymous'}
                                </div>
                            )}
                            <div className={`message ${msg.uid === currentUserUid ? 'sent' : 'received'}`}>
                                <div className="message-content">{msg.text}</div>
                            </div>
                        </div>
                    );

                })}

                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className="message-form">
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="message-input"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className="send-button">Send</button>
            </form>
        </div>
    );
};

export default ChatRoom;