// chat/page.js

'use client';

import React, { useState, useEffect } from 'react';
import useWebSocket from '../hooks/useWebSocket'; // Ensure this hook is correctly implemented
import axios from 'axios';
import './chat.css'
import { format } from 'date-fns';

const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");

// Icons made by Freepik from www.flaticon.com
const BOT_NAME = "BOT";
const PERSON_NAME = "Sajad";

msgerForm.addEventListener("submit", event => {
  event.preventDefault();

  const msgText = msgerInput.value;
  if (!msgText) return;

  appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
  msgerInput.value = "";

});

function appendMessage(name, img, side, text) {
  //   Simple solution for small apps
  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;

  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}

// Utils
function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

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
        <div className="msg left-msg">
          <div
            className="msg-img"
            style={{backgroundImage: "url(https://image.flaticon.com/icons/svg/327/327779.svg)"}}
          ></div>

          <div className="msg-bubble">
            <div className="msg-info">
              <div className="msg-info-name">BOT</div>
              <div className="msg-info-time">12:45</div>
            </div>

            <div className="msg-text">
              Hi, welcome to SimpleChat! Go ahead and send me a message. 😄
            </div>
          </div>
        </div>

        <div className="msg right-msg">
          <div
            className="msg-img"
            style={{backgroundImage: "url(https://image.flaticon.com/icons/svg/145/145867.svg)"}}
          ></div>

          <div className="msg-bubble">
            <div className="msg-info">
              <div className="msg-info-name">Jayden</div>
              <div className="msg-info-time">12:46</div>
            </div>

            <div className="msg-text">
              You can change your name in JS section!
            </div>
          </div>
        </div>
      </main>

      <form className="msger-inputarea">
        <input type="text" className="msger-input" placeholder="Enter your message..." />
        <button type="submit" className="msger-send-btn">Send</button>
      </form>
    </section>
    );
};

export default ChatPage;
