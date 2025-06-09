import React from "react";
import Video from "../components/Video/Video";
import FormCard from "../components/FormCard/FormCard";
import NavBar from "../components/NavBar/NavBar";
import { Footer, Navbar } from "../components";
import IncomingCall from "../components/IncomingCall/IncomingCall";
import { VideoCallProvider } from "../context/Context";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import "./index.css";
const VideoChat = () => {
  return (
    <React.StrictMode>
      <VideoCallProvider>
        <Navbar />
        <NavBar />
        <Video />
        <FormCard />
        <IncomingCall />
        <Footer />
      </VideoCallProvider>
    </React.StrictMode>
  );
};

export default VideoChat;
