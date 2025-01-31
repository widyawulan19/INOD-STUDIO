import React, { useEffect, useState } from 'react';
import { getMessages, sendMessage } from '../services/Api';  // Make sure sendMessage is updated
import { io } from 'socket.io-client';

const socket = io('http://localhost:3002');

const Disscution = ({ teamId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');

  // Fetch messages when component mounts
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getMessages(teamId);
        setMessages(data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };
    fetchMessages();

    // Listen for new messages
    socket.on('receive_message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Cleanup socket listener on component unmount
    return () => {
      socket.off('receive_message');
    };
  }, [teamId]);

  // Handle sending message
  const handleSendMessage = async () => {
    if (message.trim() !== '') {
      const newMessage = {
        teamId,
        userId,
        content: message,
        username: username || 'User',
      };

      try {
        // Call sendMessage API with the new message
        const response = await sendMessage(newMessage);
        console.log('Message sent successfully:', response);
        
        // Emit the message to other clients via socket
        socket.emit('send_message', newMessage);

        // Clear message input
        setMessage('');
      } catch (error) {
        console.error('Failed to send message:', error.message || error);
      }
    }
  };

  return (
    <div className='disccus-container'>
      <h2>Team Discussion</h2>
      <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '20px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <strong>{msg.username}</strong>: {msg.content}
            <div style={{ fontSize: '12px', color: 'gray' }}>
              {new Date(msg.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button onClick={handleSendMessage} style={{ padding: '10px 20px' }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Disscution;
