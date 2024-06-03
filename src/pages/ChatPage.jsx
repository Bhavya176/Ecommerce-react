import React, { useState, useEffect, useCallback, useRef } from "react";
import { Footer, Navbar } from "../components";
import socketIOClient from "socket.io-client";
import Axios from "axios";
import { useSelector } from "react-redux";

const ENDPOINT = "http://localhost:5555";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedUser, setSelectedUser] = useState(null); // User selected for chat
  const [users, setUsers] = useState([]); // All users (for admin)
  const [admins, setAdmins] = useState([]); // All admins (for users)
  const socketRef = useRef();
  const userData = useSelector((state) => state.userReducer.userInfo);

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
      const usersResponse = await Axios.get(`${ENDPOINT}/users/getUser`);
      const usersData = usersResponse.data.data;
      setUsers(usersData);

      const adminsResponse = await Axios.get(`${ENDPOINT}/users/getAdmin`);
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
    if (senderID === userData.id) return "You";
    const user =
      users.find((u) => u._id === senderID) ||
      admins.find((a) => a._id === senderID);
    return user ? user.username : "Unknown";
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Chat</h1>
        <hr />
        <div>
          {userData.role === "admin" && (
            <div>
              <h2>User List</h2>
              {users.map((u) => (
                <div key={u._id} onClick={() => handleSelectUser(u)}>
                  {u.username}
                </div>
              ))}
            </div>
          )}
          <div>
            <h2>Messages</h2>
            <div>
              {console.log("messages", messages)}
              {messages.map((msg) => (
                <div
                  key={msg._id || `${msg.sender}-${msg.content}`}
                  style={{
                    display: "flex",
                    justifyContent:
                      userData.id ===
                      (msg.sender._id === undefined
                        ? msg.sender
                        : msg.sender._id)
                        ? "flex-end"
                        : "flex-start",
                    margin: "10px 0",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "60%",
                      padding: "10px",
                      borderRadius: "10px",
                      backgroundColor:
                        userData.id ===
                        (msg.sender._id === undefined
                          ? msg.sender
                          : msg.sender._id)
                          ? "#007bff"
                          : "#f0f0f0",
                      color:
                        userData.id ===
                        (msg.sender._id === undefined
                          ? msg.sender
                          : msg.sender._id)
                          ? "#fff"
                          : "#000",
                    }}
                  >
                    <strong>{getUsername(msg.sender)}</strong>: {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ width: "80%", marginRight: "10px" }}
            />
            <button onClick={sendMessage} style={{ padding: "10px 20px" }}>
              Send
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default ChatPage;
