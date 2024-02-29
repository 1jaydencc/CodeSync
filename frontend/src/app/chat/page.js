// chat/page.js
<<<<<<< HEAD
=======
"use client";
>>>>>>> 41e84922956091fe7a5e507f0970824e58b262b6
import React, { useState, useEffect } from 'react';
import useWebSocket from '../hooks/useWebSocket';
import axios from 'axios';
<<<<<<< HEAD
=======
import './chat.css';
>>>>>>> 41e84922956091fe7a5e507f0970824e58b262b6
import { format } from 'date-fns';

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const { sendMessage } = useWebSocket('ws://localhost:8000/ws', setMessages);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/messages/default`);
                setMessages(response.data);
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            }
        };

        fetchMessages();
    }, []);

    // This event handler should be attached using React's event system, not directly to the DOM
    const handleSubmit = (event) => {
        event.preventDefault();
        const message = {
            sender_email: "user@example.com",
            message_content: newMessage,
        };
        sendMessage(JSON.stringify(message));
        setNewMessage('');
    };

    return (
<<<<<<< HEAD
        <div>
            <h2>Chat Messages</h2>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.sender_email}</strong>: {msg.message_content}
                        <br />
                        <small>{format(new Date(msg.timestamp), 'PPpp')}</small>
                    </div>
                ))}
            </div>
            <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                type="text"
                placeholder="Type a message..."
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
=======
        <section className="msger">
            <header className="msger-header">
                <div className="msger-header-title">
                    <i className="fas fa-comment-alt"></i> SimpleChat
                </div>
                <div className="msger-header-options">
                    <span><i className="fas fa-cog"></i></span>
                </div>
            </header>

            <main className="msger-chat">
                {messages.map((msg, index) => (
                    <div key={index} className={`msg ${msg.side}-msg`}>
                        <div className="msg-bubble">
                            <div className="msg-info">
                                <div className="msg-info-name">{msg.sender_name}</div>
                                <div className="msg-info-time">{format(new Date(msg.timestamp), 'PPpp')}</div>
                            </div>
                            <div className="msg-text">{msg.message_content}</div>
                        </div>
                    </div>
                ))}
            </main>
            <form className="msger-inputarea" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="msger-input"
                    placeholder="Enter your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className="msger-send-btn">Send</button>
            </form>
        </section>
>>>>>>> 41e84922956091fe7a5e507f0970824e58b262b6
    );
};

export default ChatPage;
