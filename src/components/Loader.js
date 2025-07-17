// src/components/Loader.js
import React from "react";
import { useSpring, animated } from "@react-spring/web";

const Loader = () => {
  const spin = useSpring({
    loop: true,
    to: [{ transform: "rotate(360deg)" }],
    from: { transform: "rotate(0deg)" },
    config: { duration: 1000 },
  });

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      {/* Bootstrap Spinner */}
      <div className="spinner-border text-primary mb-3" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>

      {/* Custom Animated Spinner */}
      <animated.div
        style={{
          ...spin,
          width: "40px",
          height: "40px",
          border: "5px solid #007bff",
          borderTop: "5px solid transparent",
          borderRadius: "50%",
          marginTop: "10px",
        }}
      />

      <p className="mt-3 text-muted">Please wait...</p>
    </div>
  );
};

export default Loader;
