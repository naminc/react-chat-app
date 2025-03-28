
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import UserList from "./UserList";
import "./App.css";

const socket = io();

function ChatForm({ user }) {
  const [receiver, setReceiver] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    if (!receiver) return;
    const res = await axios.get(`https://react-chat-app-1-bz2b.onrender.com/api/messages/${user.id}/${receiver.id}`);
    setMessages(res.data);
  };

  useEffect(() => {
    fetchMessages();
  }, [receiver]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      if (
        (data.sender_id === user.id && data.receiver_id === receiver?.id) ||
        (data.sender_id === receiver?.id && data.receiver_id === user.id)
      ) {
        setMessages((prev) => [...prev, data]);
      }
    });
    return () => socket.off("receive_message");
  }, [receiver]);

  const sendMessage = () => {
    if (!message || !receiver) return;
    socket.emit("send_message", {
      sender_id: user.id,
      receiver_id: receiver.id,
      message,
    });
    setMessage("");
  };

  return (
    <div className="chat-container">
      <aside className="sidebar">
        <h3>{user.username}</h3>
  
        <button
          onClick={() => {
            localStorage.removeItem("user");
            window.location.reload();
          }}
          style={{
            marginBottom: "10px",
            padding: "8px 16px",
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Đăng xuất
        </button>
        <hr style={{ marginBottom: "15px" }} />
        <UserList currentUserId={user.id} onSelectUser={setReceiver} />
        
      </aside>
  
      <main className="chat-box">
        {receiver ? (
          <>
            <header className="chat-header">
              <img src={receiver.avatar} alt="avatar" />
              <h4>{receiver.username}</h4>
            </header>
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={msg.sender_id === user.id ? "message me" : "message"}
                >
                  {msg.message}
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
              />
              <button onClick={sendMessage}>Gửi</button>
            </div>
          </>
        ) : (
          <div className="chat-placeholder">Chọn người để bắt đầu trò chuyện</div>
        )}
      </main>
    </div>
  );
  
}

export default ChatForm;
