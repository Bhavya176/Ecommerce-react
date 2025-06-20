import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { Footer, Navbar } from "../components";
import socketIOClient from "socket.io-client";
import Axios from "axios";
import { useSelector } from "react-redux";
import "../style/ChatPage.css";
import { useNavigate } from "react-router-dom";
import { AiTwotoneAudio, AiOutlineMessage } from "react-icons/ai";
import { MdSend } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import notification from "../assets/notification.mp3";
import { useTransition, animated, useSpring } from "@react-spring/web";
import debounce from "lodash.debounce";

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
  const socketRef = useRef();
  const userData = useSelector((state) => state.userReducer.userInfo);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

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

        toast.info(`${message.content}`, {
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
        const usersResponse = await Axios.get(`${ENDPOINT}users/getUser`, {
          headers: {
            Authorization: `Bearer ${userData.accessToken}`,
          },
        });
        setUsers(usersResponse.data.data);

        const adminsResponse = await Axios.get(`${ENDPOINT}users/getAdmin`, {
          headers: {
            Authorization: `Bearer ${userData.accessToken}`,
          },
        });
        setAdmins(adminsResponse.data.data);
      } catch (error) {
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

  // Fix message filtering
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

  return (
    <>
      <Navbar />
      {isAdmin ? (
        <div className="container py-3">
          <h1 className="text-center">
            Customer {userData.role === "admin" ? "Feedback" : "Support"}
          </h1>
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
                {transitions((style, msg) => {
                  const isSent =
                    userData.id ===
                    (typeof msg.sender === "string" ? msg.sender : msg.sender._id);
                  return (
                    <animated.div
                      style={style}
                      key={msg._id || msg.content}
                      className={`message-item ${isSent ? "sent" : "received"}`}
                    >
                      <div className="message-content">
                        <strong>{getUsername(msg.sender)}</strong>: {msg.content}
                      </div>
                    </animated.div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="message-input-container">
                <div className="input-container">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="message-input"
                    placeholder="Type your message here..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") sendMessage();
                    }}
                  />
                  <div
                    style={micPulse}
                    className="audio-icon"
                    onClick={startRecord}
                    title="Start voice input"
                  >
                    <AiTwotoneAudio size={24} />
                  </div>
                </div>
                <div
                  className="send-button"
                  onClick={sendMessage}
                  title="Send message"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                >
                  <MdSend size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
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
      <Footer />
    </>
  );
};

export default ChatPage;
