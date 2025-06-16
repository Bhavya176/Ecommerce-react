// src/GoogleAnalytics.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga";

// Optional: You can also initialize GA here if not done globally
ReactGA.initialize("G-YZTFK7EBHF");

const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.pageview(location.pathname + location.search);
  }, [location]);

  return null;
};

export default GoogleAnalytics;
