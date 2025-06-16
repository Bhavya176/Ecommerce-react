// src/GoogleAnalytics.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

// This should only be initialized once globally, not inside a useEffect on every render
const GA_TRACKING_ID = "G-YZTFK7EBHF";

const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Initialize Google Analytics only once
    if (window.GA_INITIALIZED) return;
    ReactGA.initialize(GA_TRACKING_ID);
    window.GA_INITIALIZED = true; // Flag to prevent re-initialization

    // Send pageview when the app is first loaded
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, []);

  useEffect(() => {
    // Track page views on route change
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]); // Trigger on location change

  return null; // This component doesn't need to render anything
};

export default GoogleAnalytics;
