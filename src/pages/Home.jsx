import { Navbar, Main, Product, Footer } from "../components";
import Lottie from "lottie-react";
import groovyWalkAnimation from "./../Animation.json";
import "./Home.css";
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { Helmet } from "react-helmet";


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
  }, []);

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
                  src="https://zeevector.com/wp-content/uploads/2021/02/50-off-sale-advertisement-Vector.jpg"
                  alt="Card"
                  style={{ height: 300 }}
                />
                <h4>SAVE UP TO 50 % OFF</h4>
              </div>
            </div>
          )}
          <Product />
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Home;
