import React, { useEffect, useState } from 'react'
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import { fetchLinkPreview, getMessagesWithReplies, sendMessage } from '../services/Api';
import '../style/ChatRoomStyle.css';

const ChatRoom=({cardId, usersCard})=> {
    console.log('card id valid, dapat digunakan di chatroom ', cardId);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    //preview link
    const [preview, setPreview] = useState(null);
    const [isHovered, setIsHovered] = useState(false);

    //1. fungsi untuk menampilkan pesan dan balasan saat komponen pertama kali dimuat
    useEffect(() =>{
        const fetchMessages = async () =>{
            try{
                const data = await getMessagesWithReplies(cardId);
                setMessages(data);
            }catch(error){
                console.error('Error fetch messages:', error);
            }
        };
        fetchMessages();
    },[cardId]);

    //2. mengirim pesan baru
    const handleSendMessage = async (e) =>{
        e.preventDefault();

        try{
            const newMessage = await sendMessage({
                newMessage,
                usersCard,
                card_id:cardId
            });
            console.log("Pesan berhasil dikirim:", newMessage);
            setNewMessage("");

        }catch(error){
            console.error('Gagal mengirim pesan');
        }
    }

    //generate profile initials
    const generateProfileInitials = (name) =>{
        if(!name) return '';
        const nameParts = name.split(' ');
        const initials = nameParts.map((part) => part.charAt(0).toUpperCase()).join('');
        return initials.slice(0, 2);
    }
    //generate color from username
    const generateColorFromName = (name) => {
        if (!name) return '#ccc'; // Default color if name is undefined
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const color = `#${((hash >> 24) & 0xff).toString(16).padStart(2, '0')}${((hash >> 16) & 0xff).toString(16).padStart(2, '0')}${((hash >> 8) & 0xff).toString(16).padStart(2, '0')}`.slice(0, 7);
        return color;
    };

    //parsing message link
    const parseMessageContent = (content) =>{
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = content.match(urlRegex);
        return content.replace(urlRegex, (url) => {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
        });
    }
    
    //preview link 
    useEffect(()=>{
        if(isHovered){
            const getPreview = async () =>{
                try{
                    const data = await fetchLinkPreview();
                    setPreview(data);
                }catch(error){
                    console.error('Failed to fetch preview', error);
                }
            };
            getPreview();
        }else{
            setPreview(null);
        }
    },[isHovered,])

  return (
          <div className="chat-container">
              <div className="chat-header">
                  <h4>Discussion Room</h4>
                  <IoEllipsisVerticalSharp className="ikon-message" />
              </div>
  
              <div className="chat-body-container">
                  {messages.map((m) => {
                      return (
                          <div key={m.id} className="chat-box">
                              <div className="profile-container">
                                  <div className="profile" style={{ backgroundColor: generateColorFromName(m.user) }}>
                                      <span>{generateProfileInitials(m.user)}</span>
                                  </div>
                                  <div className="chat-content">
                                      <div className="chat-body-box">
                                          <div className="chat-body">
                                              <p>
                                                  <strong>{m.user}</strong>:{" "}
                                                  <span
                                                      dangerouslySetInnerHTML={{ __html: parseMessageContent(m.content) }}
                                                  />
                                              </p>        
                                              <IoEllipsisVerticalSharp className="ikon-message" />
                                          </div>
                                      </div>
                                  </div>
                                
                                  <div className="date-chat">
                                      <p>
                                          {new Date(m.timestamp).toLocaleTimeString("en-US", {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                          })}
                                      </p>
                                  </div>
                              </div>
  
                              {/* Menampilkan balasan jika ada */}
                              <div className="reply-container">
                                  {m.replies?.length > 0 && (
                                      <div className="reply-content">
                                          {m.replies.map((reply) => (
                                              <div key={reply.id} className="reply-box">
                                                  <div className="reply-profile">
                                                      <div
                                                          className="profile"
                                                          style={{ backgroundColor: generateColorFromName(reply.user) }}
                                                      >
                                                          <span>{generateProfileInitials(reply.user)}</span>
                                                      </div>
                                                      <div className="reply-body">
                                                          <p>
                                                              <strong>{reply.user}</strong>: {reply.content}
                                                          </p>
                                                      </div>
                                                  </div>
                                                  <p className="reply-date">
                                                      {new Date(reply.timestamp).toLocaleTimeString()}
                                                  </p>
                                              </div>
                                          ))}
                                      </div>
                                  )}
                              </div>
                          </div>
                      );
                  })}
              </div>
              
              {/* Form kirim pesan */}
              <div className="form-message">
                  <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Tulis pesan..."
                      required
                  />
                  <button type="submit" onClick={handleSendMessage}>
                      Send
                  </button>
              </div>
          </div>
      );
}

export default ChatRoom

//new Project - track(gambar)-nama buyer- Akun-code order (5 dari belakang)