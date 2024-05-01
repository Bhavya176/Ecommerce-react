import { Navbar, Main, Product, Footer } from "../components";
import Lottie from "lottie-react";
import groovyWalkAnimation from "./../Animation.json";
import "./Home.css";

function Home() {
  return (
    <>
      <Navbar />
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
          <Product />
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Home;
