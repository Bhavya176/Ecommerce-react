import { Navbar, Main, Product, Footer } from "../components";
import Lottie from "lottie-react";
import groovyWalkAnimation from "./../Animation.json";
import "./Home.css";
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { Helmet } from "react-helmet";
import ChatbotWidget from "../components/ChatbotWidget";
var md5 = require("md5");
function Home() {
  const [showBanner, setShowBanner] = useState(false);

  // Check if the banner has been displayed before
  useEffect(() => {
    const lastDisplayedDate = localStorage.getItem("lastDisplayedDate");
    const currentDate = new Date().toLocaleDateString();

    if (lastDisplayedDate !== currentDate) {
      setShowBanner(true); // If the banner has not been displayed today, show it
    } else {
      setShowBanner(false); // If it has been displayed today, hide the banner
    }
    // abc();
    // callHuggingFace();
    // getMarvelData()
    // callGemini();
  }, []);

  // async function getMarvelData() {
  //   const publicKey = "b1f5bde940df918b47ce5ba92c111784";
  //   const privateKey = "7fe6f3d77a2828011f179e55157c9ec1879c3055";
  //   const ts = Date.now();
  //   const hash = md5(ts + privateKey + publicKey);
  //   const apiUrl = `https://gateway.marvel.com/v1/public/comics?ts=${ts}&apikey=${publicKey}&hash=${hash}&format=comic`; // Example character endpoint

  //   try {
  //     const response = await fetch(apiUrl);
  //     const data = await response.json();

  //     if (data.code === 200) {
  //       const results = data.data.results;
  //       // Process the results array
  //       console.log(results);
  //       return results;
  //     } else {
  //       console.error("API Error:", data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // }

  // Function to handle banner close
  const handleCloseBanner = () => {
    setShowBanner(false);
    const currentDate = new Date().toLocaleDateString();
    // Set the current date in local storage indicating the banner has been displayed today
    localStorage.setItem("lastDisplayedDate", currentDate);
  };

  return (
    <>
      <Navbar />
      <Helmet>
        <title>Home Page</title>
        <meta name="description" content="Welcome to the Home Page" />
        <meta name="keywords" content="home, react, app" />
        <meta name="author" content="Bhavya Savaliya" />
      </Helmet>
      <div
        style={{
          background: "linear-gradient(#3f87a6, #ebf8e1, #f69d3c)",
        }}
      >
        <Main />
        <div className="background-animation">
          <Lottie animationData={groovyWalkAnimation} />
        </div>

        <div className="content">
          {showBanner && (
            <div
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                zIndex: 1000,
              }}
            >
              <div style={{ textAlign: "right" }}>
                <FaTimes
                  onClick={handleCloseBanner}
                  style={{ cursor: "pointer" }}
                />
              </div>
              <div style={{ textAlign: "center" }}>
                {/* Your advertisement banner content goes here */}
                <img
                  className="card-img img-fluid"
                  src="https://static.vecteezy.com/system/resources/previews/006/081/808/non_2x/50-percent-off-comic-book-style-art-special-offer-and-discount-vector.jpg"
                  alt="Card"
                  style={{ height: 300 }}
                />
                <h4>SAVE UP TO 50 % OFF</h4>
              </div>
            </div>
          )}
          <ChatbotWidget />
          <Product />
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Home;
