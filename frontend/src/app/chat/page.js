// pages/chat/page.js
import useWebSocket from '../hooks/useWebSocket';

const ChatPage = () => {
    const { messages, sendMessage } = useWebSocket('ws://localhost:8000/ws'); // Adjust with your WebSocket server URL
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        sendMessage({ content: newMessage });
        setNewMessage(''); // Clear input after sending
    };

    return (
        <div>
            <h2>Chat Messages</h2>
            <div>
                {messages.map((msg, index) => (
                    <p key={index}>{msg.content}</p> // Customize based on your message structure
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
