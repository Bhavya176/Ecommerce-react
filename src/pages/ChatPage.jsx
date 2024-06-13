import React, { useState, useEffect, useCallback, useRef } from "react";
import { Footer, Navbar } from "../components";
import socketIOClient from "socket.io-client";
import Axios from "axios";
import { useSelector } from "react-redux";
import "../style/ChatPage.css";
import { useNavigate } from "react-router-dom";
import { AiTwotoneAudio } from "react-icons/ai";
import { MdSend } from "react-icons/md";
const ENDPOINT = process.env.REACT_APP_CLIENT_URL;
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
var current, transcript, upperCase;
const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedUser, setSelectedUser] = useState(null); // User selected for chat
  const [users, setUsers] = useState([]); // All users (for admin)
  const [admins, setAdmins] = useState([]); // All admins (for users)
  const socketRef = useRef();
  const userData = useSelector((state) => state.userReducer.userInfo);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const startRecord = (e) => {
    recognition.start(e);
    recognition.onresult = (e) => {
      current = e.resultIndex;
      transcript = e.results[current][0].transcript;
      upperCase = transcript.charAt(0).toUpperCase() + transcript.substring(1);
      setInput(transcript);
    };
  };
  useEffect(() => {
    socketRef.current = socketIOClient(ENDPOINT);

    socketRef.current.on("load messages", (messages) => {
      setMessages(messages);
    });

    socketRef.current.on("receive message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const getData = async () => {
    try {
      const usersResponse = await Axios.get(`${ENDPOINT}users/getUser`);
      const usersData = usersResponse.data.data;
      setUsers(usersData);

      const adminsResponse = await Axios.get(`${ENDPOINT}users/getAdmin`);
      const adminsData = adminsResponse.data.data;
      setAdmins(adminsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    if (userData) {
      socketRef.current.emit("load messages", userData.id);
      if (userData.role === "user") {
        setSelectedUser(admins[0]);
      }
    }
  }, [userData, admins]);

  const sendMessage = useCallback(() => {
    if (!input || !selectedUser) return;

    const message = {
      sender: userData.id,
      receiver: selectedUser._id,
      content: input,
    };

    socketRef.current.emit("send message", message);
    // setMessages((prevMessages) => [...prevMessages, message]);
    setInput("");
  }, [input, selectedUser, userData]);

  const handleSelectUser = useCallback((user) => {
    setSelectedUser(user);
  }, []);

  const getUsername = (id) => {
    const senderID = id._id === undefined ? id : id._id;
    if (senderID === userData.id) return userData.username;
    const user =
      users.find((u) => u._id === senderID) ||
      admins.find((a) => a._id === senderID);
    return user ? user.username : "Unknown";
  };

  const filteredMessages = selectedUser
    ? messages.filter((msg) => {
        const senderId =
          msg.sender._id === undefined ? msg.sender : msg.sender._id;
        const receiverId =
          msg.sender._id === undefined ? msg.receiver : msg.receiver._id;
        return (
          (senderId === selectedUser._id && receiverId === userData.id) ||
          (senderId === userData.id && receiverId === selectedUser._id)
        );
      })
    : [];
  useEffect(() => {
    if (userData === null) {
      navigate("*");
    } else {
      setIsAdmin(true);
    }
  }, [userData, navigate]);

  return (
    <>
      <Navbar />
      {isAdmin === true ? (
        <div className="container  py-3">
          <h1 className="text-center">Chat</h1>
          <hr />

          <div className="chat-container">
            {userData.role === "admin" && (
              <div className="user-list">
                <h2>User Lists</h2>
                {users.map((u) => (
                  <div
                    key={u._id}
                    className={`user-item ${
                      selectedUser?._id === u._id ? "selected" : ""
                    }`}
                    onClick={() => handleSelectUser(u)}
                  >
                    {u.username}
                  </div>
                ))}
              </div>
            )}
            <div className="chat-box">
              <div className="messages">
                {filteredMessages.map((msg) => (
                  <div
                    key={msg._id || `${msg.sender}-${msg.content}`}
                    className={`message-item ${
                      userData.id ===
                      (msg.sender._id === undefined
                        ? msg.sender
                        : msg.sender._id)
                        ? "sent"
                        : "received"
                    }`}
                  >
                    <div className="message-content">
                      <strong>{getUsername(msg.sender)}</strong>: {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              <div className="message-input-container">
                <div className="input-container">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="message-input"
                  />
                  <div className="audio-icon" onClick={(e) => startRecord(e)}>
                    <AiTwotoneAudio />
                  </div>
                </div>
                <div className="send-button" onClick={sendMessage}>
                  <MdSend />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      <Footer />
    </>
  );
};
export default ChatPage;
