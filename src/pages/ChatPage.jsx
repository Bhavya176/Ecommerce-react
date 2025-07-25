import React, {
  useState, useEffect, useCallback, useRef, useMemo
} from "react";
import { Footer, Navbar } from "../components";
import socketIOClient from "socket.io-client";
import Axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiTwotoneAudio, AiOutlineMessage } from "react-icons/ai";
import { MdSend } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import notification from "../assets/notification.mp3";
import { useTransition, animated, useSpring } from "@react-spring/web";
import debounce from "lodash.debounce";
import {
  Layout, Card, List, Avatar, Input, Button, Typography, Badge, Spin
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import "../style/ChatPage.css";

const { Content, Sider } = Layout;
const { Text } = Typography;

const ENDPOINT = process.env.REACT_APP_CLIENT_URL;
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

const ChatPage = () => {
  const notificationSound = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef();
  const userData = useSelector((state) => state.userReducer.userInfo);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // Animate microphone pulse
  const micPulse = useSpring({
    loop: { reverse: true },
    from: { transform: "scale(1)" },
    to: { transform: "scale(1.15)" },
    config: { duration: 900 },
  });

  // Smooth scroll to bottom on messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedUser]);

  // Debounce input update from speech recognition
  const setInputDebounced = useMemo(() => debounce(setInput, 250), []);

  const startRecord = () => {
    recognition.start();
    recognition.onresult = (e) => {
      const transcript = e.results[e.resultIndex][0].transcript;
      setInputDebounced(transcript);
    };
    recognition.onerror = (e) => {
      toast.error("Speech recognition error: " + e.error);
    };
  };

  useEffect(() => {
    socketRef.current = socketIOClient(ENDPOINT);

    socketRef.current.on("load messages", (messages) => {
      setMessages(messages);
    });

    socketRef.current.on("receive message", (message) => {
      if (userData.id !== message.sender) {
        if (notificationSound.current) {
          notificationSound.current.play();
        }
        toast.info(message.content, {
          icon: <AiOutlineMessage className="notification-message" size={30} />,
        });
      }
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [userData]);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const usersResponse = await Axios.get(`${ENDPOINT}users/getUser`, {
          headers: { Authorization: `Bearer ${userData.accessToken}` },
        });
        setUsers(usersResponse.data.data);

        const adminsResponse = await Axios.get(`${ENDPOINT}users/getAdmin`, {
          headers: { Authorization: `Bearer ${userData.accessToken}` },
        });
        setAdmins(adminsResponse.data.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:", error);
      }
    };
    if (userData) getData();
  }, [userData]);

  useEffect(() => {
    if (userData) {
      socketRef.current.emit("load messages", userData.id);
      if (userData.role === "user" && admins.length > 0) {
        setSelectedUser(admins[0]);
      }
    }
  }, [userData, admins]);

  const sendMessage = useCallback(() => {
    if (!input.trim() || !selectedUser) return;
    const message = {
      sender: userData.id,
      receiver: selectedUser._id,
      content: input.trim(),
    };
    socketRef.current.emit("send message", message);
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

  // Filter messages for selected user
  const filteredMessages = selectedUser
    ? messages.filter((msg) => {
        const senderId =
          typeof msg.sender === "string" ? msg.sender : msg.sender?._id;
        const receiverId =
          typeof msg.receiver === "string" ? msg.receiver : msg.receiver?._id;
        return (
          (senderId === selectedUser._id && receiverId === userData.id) ||
          (senderId === userData.id && receiverId === selectedUser._id)
        );
      })
    : [];

  // Animate message list with react-spring transitions
  const transitions = useTransition(filteredMessages, {
    keys: (item) => item._id || item.content + Math.random(),
    from: { opacity: 0, transform: "translate3d(0,20px,0)" },
    enter: { opacity: 1, transform: "translate3d(0,0,0)" },
    leave: { opacity: 0, transform: "translate3d(0,-20px,0)" },
    config: { tension: 210, friction: 20 },
  });

  useEffect(() => {
    if (!userData) {
      navigate("*");
    } else {
      setIsAdmin(true);
    }
  }, [userData, navigate]);

  // Responsive layout: Sider collapses on mobile
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <Navbar />
      <Layout style={{ minHeight: "80vh", background: "#f5f6fa" }}>
        {isAdmin && (
          <Sider
            width={200}
            breakpoint="md"
            collapsedWidth="0"
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            style={{
              background: "#fff",
              borderRight: "1px solid #f0f0f0",
              padding: "5px 0",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <Text strong style={{ fontSize: 18 }}>
                {userData.role === "admin" ? "User List" : "Support"}
              </Text>
            </div>
            <List
              itemLayout="horizontal"
              dataSource={userData.role === "admin" ? users : admins}
              renderItem={user => (
                <List.Item
                  className={`user-list-item${selectedUser?._id === user._id ? " selected" : ""}`}
                  style={{
                    cursor: "pointer",
                    background: selectedUser?._id === user._id ? "#e6f7ff" : "transparent",
                    borderRadius: 8,
                    margin: "4px 8px",
                  }}
                  onClick={() => handleSelectUser(user)}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={<UserOutlined />}
                        style={{ background: "#1890ff" }}
                      />
                    }
                    title={<span style={{ fontWeight: 500 }}>{user.username}</span>}
                  />
                </List.Item>
              )}
            />
          </Sider>
        )}

        <Layout>
          <Content
            style={{
              padding: "5px",
              // maxWidth: 1400,
              margin: "0 auto",
              width: "100%",
              // minHeight: "100vh",
            }}
          >
            <Card
              style={{
                width: "100%",
                // minHeight: 500,
                boxShadow: "0 2px 8px #f0f1f2",
                borderRadius: 16,
                display: "flex",
                flexDirection: "column",
                background: "#fff",
              }}
              bodyStyle={{ flex: 1, display: "flex", flexDirection: "column" }}
            >
              <div style={{ marginBottom: 16, textAlign: "center" }}>
                <Text strong style={{ fontSize: 22 }}>
                  {userData.role === "admin"
                    ? selectedUser
                      ? `Chat with ${selectedUser.username}`
                      : "Select a user"
                    : "Support Chat"}
                </Text>
              </div>
              <div
                className="messages"
                style={{
                  flex: 1,
                  overflowY: "auto",
                  background: "#f9fafb",
                  borderRadius: 8,
                  minHeight: isMobile?435:470,
                  maxHeight: isMobile?435:470,
                }}
              >
                {loading ? (
                  <div style={{ textAlign: "center", marginTop: 60 }}>
                    <Spin size="large" />
                  </div>
                ) : (
                  transitions((style, msg) => {
                    const isSent =
                      userData.id ===
                      (typeof msg.sender === "string"
                        ? msg.sender
                        : msg.sender._id);
                    return (
                      <animated.div
                        style={style}
                        key={msg._id || msg.content}
                        className={`message-item ${isSent ? "sent" : "received"}`}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: isSent ? "row-reverse" : "row",
                            alignItems: "flex-end",
                            marginBottom: 8,
                          }}
                        >
                          <Avatar
                            style={{
                              background: isSent ? "#1890ff" : "#f56a00",
                              margin: isSent ? "0 0 0 8px" : "0 8px 0 0",
                            }}
                            icon={<UserOutlined />}
                          />
                          <div
                            style={{
                              background: isSent ? "#e6f7ff" : "#fffbe6",
                              color: "#222",
                              borderRadius: 12,
                              padding: "8px 14px",
                              maxWidth: 320,
                              boxShadow: "0 1px 4px #f0f1f2",
                            }}
                          >
                            <Text strong style={{ fontSize: 14 }}>
                              {getUsername(msg.sender)}
                            </Text>
                            <div style={{ fontSize: 15, marginTop: 2 }}>
                              {msg.content}
                            </div>
                          </div>
                        </div>
                      </animated.div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
              <div
                className="message-input-container"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 8,
                }}
              >
                <Input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") sendMessage();
                  }}
                  placeholder="Type your message..."
                  size="large"
                  style={{ flex: 1, borderRadius: 8 }}
                  disabled={!selectedUser}
                />
                <animated.div
                  style={micPulse}
                  className="audio-icon"
                  onClick={startRecord}
                  title="Start voice input"
                >
                  <Button
                    shape="circle"
                    icon={<AiTwotoneAudio size={22} />}
                    size="large"
                  />
                </animated.div>
                <Button
                  type="primary"
                  shape="circle"
                  icon={<MdSend size={22} />}
                  size="large"
                  onClick={sendMessage}
                  disabled={!input.trim() || !selectedUser}
                />
              </div>
            </Card>
          </Content>
        </Layout>
      </Layout>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        toastClassName="custom-toast"
      />
      <audio src={notification} ref={notificationSound} />
      {/* <Footer /> */}
    </>
  );
};

export default ChatPage;