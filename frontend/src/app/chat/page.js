"use client";
import React, { useState, useEffect } from 'react';
import useWebSocket from '../hooks/useWebSocket'; 
import axios from 'axios';
import './chat.css'; 

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

    const handleSendMessage = (event) => {
        event.preventDefault();
        const message = {
            sender_email: "user@example.com",
            message_content: newMessage,
        };
        sendMessage(JSON.stringify(message));
        setNewMessage('');
    };

    return (
        // Wrap everything in a single div or React.Fragment (<> ... </>)
        <div> 
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
            {/* Ensure that the following section is correctly nested within the root div */}
            <section className="msger">
                {/* Section content */}
            </section>
        </div>
    );
};

export default ChatPage;
