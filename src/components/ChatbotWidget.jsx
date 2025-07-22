import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [messages, setMessages] = useState([
    { role: "system", content: "You are a helpful assistant." },
  ]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const toggleWidget = () => setIsOpen(!isOpen);
  const toggleTheme = () => setDarkMode((d) => !d);
  const toggleFullscreen = () => setIsFullscreen((prev) => !prev);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen && !hasGreeted) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "👋 Hello! How can I help you today?" },
        ]);
        setHasGreeted(true);
      }, 500);
    }
  }, [isOpen, hasGreeted]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setIsTyping(true);

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        // model = deepseek/deepseek-r1-0528:free
        // deepseek/deepseek-chat-v3-0324:free
        // google/gemma-3n-e2b-it:free
        // google/gemini-2.0-flash-exp:free
        // meta-llama/llama-3.2-11b-vision-instruct:free
        // What is the meaning of life?
        //  today weather in rajkot
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct:free",
          messages: newMessages.filter((m) => m.role !== "system"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "API Error");

      const fullReply = data.choices?.[0]?.message?.content || "(no response)";
      let display = "";
      setMessages((msgs) => [...msgs, { role: "assistant", content: "" }]);
      setIsTyping(false);

      for (const char of fullReply) {
        display += char;
        setMessages((msgs) => {
          const copy = [...msgs];
          copy[copy.length - 1] = { role: "assistant", content: display };
          return copy;
        });
        await new Promise((r) => setTimeout(r, 15));
      }
    } catch (err) {
      setIsTyping(false);
      setMessages((msgs) => [
        ...msgs,
        { role: "assistant", content: `❌ Error: ${err.message}` },
      ]);
    }
    setLoading(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Better notification instead of alert
    const notification = document.createElement("div");
    notification.textContent = "✅ Code copied!";
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 10px 20px;
      border-radius: 8px;
      z-index: 10000;
      font-family: Arial, sans-serif;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    document.body.appendChild(notification);
    setTimeout(() => document.body.removeChild(notification), 2000);
  };

  const renderers = {
    code({ node, inline, className, children }) {
      const match = /language-(\w+)/.exec(className || "");
      const style = darkMode ? oneDark : oneLight;
      const codeStr = String(children).replace(/\n$/, "");
      if (!inline && match) {
        return (
          <div style={{ position: "relative", margin: "10px 0" }}>
            <button
              onClick={() => copyToClipboard(codeStr)}
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                background: darkMode
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)",
                border: "none",
                padding: "6px 12px",
                cursor: "pointer",
                borderRadius: 6,
                fontSize: 12,
                color: darkMode ? "#fff" : "#000",
                backdropFilter: "blur(10px)",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.background = darkMode
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(0,0,0,0.2)";
              }}
              onMouseOut={(e) => {
                e.target.style.background = darkMode
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)";
              }}
            >
              📋 Copy
            </button>
            <SyntaxHighlighter language={match[1]} style={style}>
              {codeStr}
            </SyntaxHighlighter>
          </div>
        );
      }
      return (
        <code
          className={className}
          style={{
            background: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
            padding: "2px 6px",
            borderRadius: 4,
            fontFamily: "monospace",
          }}
        >
          {children}
        </code>
      );
    },
  };

  return (
    <div style={styles.container}>
      {isOpen && (
        <div
          style={{
            ...styles.window,
            ...(isFullscreen && {
              width: "95vw",
              height: "80vh",
              borderRadius: 0,
              bottom: 0,
              right: 0,
            }),
            background: darkMode ? "#1a1a1a" : "#ffffff",
            animation: "slideInUp 0.3s ease-out",
          }}
        >
          <div
            style={{
              ...styles.header,
              background: darkMode
                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                : "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            }}
          >
            <div style={styles.headerContent}>
              <div style={styles.botInfo}>
                <div style={styles.botAvatar}>🤖</div>
                <div>
                  <div style={styles.botName}>AI Assistant</div>
                  <div style={styles.botStatus}>
                    {loading ? "Thinking..." : "Online"}
                  </div>
                </div>
              </div>
              <div style={styles.headerButtons}>
                <button onClick={toggleTheme} style={styles.themeButton}>
                  {darkMode ? "☀️" : "🌙"}
                </button>
                <button onClick={toggleFullscreen} style={styles.themeButton}>
                  {isFullscreen ? "🗗" : "🗖"}
                </button>
                <button onClick={toggleWidget} style={styles.closeButton}>
                  ✕
                </button>
              </div>
            </div>
          </div>

          <div
            style={{
              ...styles.messages,
              height: isFullscreen ? "calc(100vh - 140px)" : undefined,
              background: darkMode
                ? "linear-gradient(180deg, #2d2d2d 0%, #1a1a1a 100%)"
                : "linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)",
            }}
          >
            {messages
              .filter((m) => m.role !== "system")
              .map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    ...styles.messageWrapper,
                    justifyContent:
                      msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  {msg.role === "assistant" && (
                    <div style={styles.assistantAvatar}>🤖</div>
                  )}
                  <div
                    style={{
                      ...styles.bubble,
                      backgroundColor:
                        msg.role === "user"
                          ? darkMode
                            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            : "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                          : darkMode
                          ? "#2d2d2d"
                          : "#ffffff",
                      color:
                        msg.role === "user"
                          ? darkMode
                            ? "#fff"
                            : "#333"
                          : darkMode
                          ? "#e0e0e0"
                          : "#333",

                      boxShadow: darkMode
                        ? "0 4px 15px rgba(0,0,0,0.3)"
                        : "0 4px 15px rgba(0,0,0,0.1)",
                      border:
                        msg.role === "assistant" && !darkMode
                          ? "1px solid #e0e0e0"
                          : "none",
                      animation: "messageSlideIn 0.3s ease-out",
                    }}
                  >
                    <ReactMarkdown components={renderers}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                  {msg.role === "user" && (
                    <div style={styles.userAvatar}>👤</div>
                  )}
                </div>
              ))}
            {(loading || isTyping) && (
              <div style={styles.messageWrapper}>
                <div style={styles.assistantAvatar}>🤖</div>
                <div
                  style={{
                    ...styles.bubble,
                    backgroundColor: darkMode ? "#2d2d2d" : "#ffffff",
                    border: !darkMode ? "1px solid #e0e0e0" : "none",
                    boxShadow: darkMode
                      ? "0 4px 15px rgba(0,0,0,0.3)"
                      : "0 4px 15px rgba(0,0,0,0.1)",
                    color: darkMode ? "#e0e0e0" : "#333",
                  }}
                >
                  <div style={styles.typingIndicator}>
                    <div style={styles.typingDot}></div>
                    <div style={styles.typingDot}></div>
                    <div style={styles.typingDot}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef}></div>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{
              ...styles.form,
              background: darkMode ? "#2d2d2d" : "#ffffff",
              borderTop: `1px solid ${darkMode ? "#444" : "#e0e0e0"}`,
            }}
          >
            <div style={styles.inputContainer}>
              <input
                style={{
                  ...styles.input,
                  background: darkMode ? "#1a1a1a" : "#f8f9fa",
                  color: darkMode ? "#e0e0e0" : "#333",
                  border: `1px solid ${darkMode ? "#444" : "#e0e0e0"}`,
                }}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                style={{
                  ...styles.sendButton,
                  background:
                    loading || !input.trim()
                      ? darkMode
                        ? "#333"
                        : "#ccc"
                      : darkMode
                      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      : "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                  cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "⏳" : "🚀"}
              </button>
            </div>
          </form>
        </div>
      )}

      {!isOpen && (
        <div
          onClick={toggleWidget}
          style={{
            ...styles.toggleButtonContainer,
            background: darkMode
              ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              : "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
          }}
        >
          <div style={styles.toggleContent}>
            <div style={styles.toggleIcon}>🤖</div>
            <div style={styles.toggleText}>Chat</div>
          </div>
        </div>
      )}

      <EnhancedCssInjection />
    </div>
  );
}

function EnhancedCssInjection() {
  useEffect(() => {
    const css = `
      @keyframes slideInUp {
        0% { transform: translateY(100%); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
      }
      
      @keyframes messageSlideIn {
        0% { transform: translateY(20px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
      }
      
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      @keyframes typing {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-10px); }
      }
      
      @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      .chatbot-widget * {
        box-sizing: border-box;
      }
      
      .chatbot-widget button:hover {
        transform: translateY(-1px);
      }
      
      .chatbot-widget button:active {
        transform: translateY(0);
      }
    `;

    const styleEl = document.createElement("style");
    styleEl.innerHTML = css;
    document.head.appendChild(styleEl);

    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);
  return null;
}

const styles = {
  container: {
    position: "fixed",
    bottom: 20,
    right: 20,
    zIndex: 1000,
    fontFamily:
      "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    className: "chatbot-widget",
  },
  window: {
    width: 380,
    height: 550,
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
    borderRadius: 16,
    overflow: "hidden",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  header: {
    padding: "16px 20px",
    color: "#fff",
    position: "relative",
    overflow: "hidden",
  },
  headerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    zIndex: 1,
  },
  botInfo: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
  },
  botName: {
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 2,
  },
  botStatus: {
    fontSize: 12,
    opacity: 0.9,
  },
  headerButtons: {
    display: "flex",
    gap: 8,
  },
  themeButton: {
    background: "rgba(255,255,255,0.2)",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    padding: "8px 10px",
    borderRadius: 8,
    fontSize: 14,
    transition: "all 0.2s ease",
  },
  closeButton: {
    background: "rgba(255,255,255,0.2)",
    border: "none",
    color: "#fff",
    fontSize: 14,
    cursor: "pointer",
    padding: "8px 10px",
    borderRadius: 8,
    transition: "all 0.2s ease",
  },
  messages: {
    flex: 1,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    gap: 16,
  },
  messageWrapper: {
    display: "flex",
    alignItems: "flex-end",
    gap: 8,
    marginBottom: 4,
  },
  bubble: {
    maxWidth: "75%",
    padding: "12px 16px",
    borderRadius: 18,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    fontSize: 14,
    lineHeight: 1.4,
    position: "relative",
  },
  assistantAvatar: {
    width: 24,
    height: 24,
    borderRadius: "50%",
    background: "rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    flexShrink: 0,
  },
  userAvatar: {
    width: 24,
    height: 24,
    borderRadius: "50%",
    background: "rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    flexShrink: 0,
  },
  typingIndicator: {
    display: "flex",
    gap: 4,
    alignItems: "center",
    padding: "4px 0",
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "currentColor",
    opacity: 0.6,
    animation: "typing 1.4s infinite",
  },
  form: {
    padding: "16px 20px",
    borderTop: "1px solid rgba(0,0,0,0.1)",
  },
  inputContainer: {
    display: "flex",
    gap: 12,
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: 12,
    fontSize: 14,
    outline: "none",
    transition: "all 0.2s ease",
    resize: "none",
  },
  sendButton: {
    padding: "12px 16px",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    borderRadius: 12,
    transition: "all 0.2s ease",
    minWidth: 48,
    height: 48,
  },
  toggleButtonContainer: {
    borderRadius: 24,
    padding: "12px 16px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    animation: "pulse 2s infinite",
  },
  toggleContent: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#fff",
  },
  toggleIcon: {
    fontSize: 20,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
  },
};
