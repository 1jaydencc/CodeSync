// hooks/useWebSocket.js
import { useEffect, useState, useRef } from 'react';

const useWebSocket = (url) => {
    const [messages, setMessages] = useState([]);
    const websocket = useRef(null);

    useEffect(() => {
        // Initialize WebSocket connection
        websocket.current = new WebSocket(url);
        websocket.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages((prev) => [...prev, message]);
        };

        // Clean up function to close connection on component unmount
        return () => {
            websocket.current.close();
        };
    }, [url]);

    const sendMessage = (message) => {
        if (websocket.current) {
            websocket.current.send(JSON.stringify(message));
        }
    };

    return { messages, sendMessage };
};

export default useWebSocket;
