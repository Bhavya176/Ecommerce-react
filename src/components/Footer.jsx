import React from "react";

const Footer = () => {
  return (
    <footer
      style={{
        textAlign: "center",

        // backgroundColor: "#f8f9fa",
        color: "#333",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // paddingBottom: "5rem",
        }}
      >
        <div style={{ maxWidth: "600px", textAlign: "center" }}>
          <p
            style={{
              // marginBottom: "1rem",
              fontSize: "16px",
              color: "#555",
            }}
          >
            Made with ❤️ by Bhavya Savaliya
            <a
              href="https://github.com/Bhavya176"
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#333",
                fontSize: "16px",
                textDecoration: "none",
                marginLeft: "10px",
              }}
            >
              <i className="bi bi-github"></i>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
