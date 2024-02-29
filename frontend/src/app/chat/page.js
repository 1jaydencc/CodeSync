// chat/page.js
import React, { useState, useEffect } from 'react';
import useWebSocket from '../hooks/useWebSocket'; // Ensure this hook is correctly implemented
import axios from 'axios';
import { format } from 'date-fns';

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const { sendMessage } = useWebSocket('ws://localhost:8000/ws', setMessages);
    // Assuming useWebSocket hook is designed to update messages state directly

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                // Might need adjustments
                const response = await axios.get(`http://localhost:8000/messages/default`);
                setMessages(response.data);
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            }
        };

        fetchMessages();
    }, []);

    const handleSendMessage = () => {
        // Construct message object based on your ChatMessageSchema
        const message = {
            sender_email: "user@example.com", // Replace with actual user email from auth context/session
            message_content: newMessage,
        };
        sendMessage(JSON.stringify(message));
        setNewMessage('');
    };

    return (
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
    );
};

export default ChatPage;
