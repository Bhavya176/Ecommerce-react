import React from "react";
import { Footer, Navbar } from "../components";
// import TextToSpeech from "../components/TextToSpeech";
import { Helmet } from "react-helmet";
const AboutPage = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  // const text =
  //   "No library required To Build a Text-to-Speech component in React.";
  return (
    <>
      <Navbar />
      <Helmet>
        <title>About Us</title>
        <meta name="description" content="Learn more about our app and team" />
        <meta name="keywords" content="about, company, team, react" />
        <meta name="author" content="Bhavya Savaliya" />
      </Helmet>
      <div className="container py-3">
        <h1 className="text-center">About Us</h1>
        <hr />
        <p className="lead text-center">
          At UniversalCart, we are committed to providing a seamless online
          shopping experience. Our platform offers a wide range of products to
          meet your needs, backed by reliable customer support. Whether you're
          looking for the latest gadgets, fashion, or home essentials, we strive
          to deliver quality and convenience at your fingertips.
        </p>
        {/* <h1>My Blog Post</h1>
        <TextToSpeech text={text} />
        <p>{text}</p> */}
        <div className="my-5 text-center">
          <h2 className="mb-4">Watch Our Introduction</h2>
          <div className="ratio ratio-16x9">
            <iframe
              src="https://res.cloudinary.com/djasa2x44/video/upload/v1749550289/b1sijnfukp4x8yvhyvhk.mp4"
              title="About Our Website"
              allowFullScreen
            ></iframe>
          </div>
        </div>
        <h2 className="text-center py-4">Our Products</h2>
        <div className="row">
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100">
              <img
                className="card-img-top img-fluid"
                src="https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt=""
                height={160}
              />
              <div className="card-body">
                <h5 className="card-title text-center">Mens's Clothing</h5>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100">
              <img
                className="card-img-top img-fluid"
                src="https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt=""
                height={160}
              />
              <div className="card-body">
                <h5 className="card-title text-center">Women's Clothing</h5>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100">
              <img
                className="card-img-top img-fluid"
                src="https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt=""
                height={160}
              />
              <div className="card-body">
                <h5 className="card-title text-center">Jewelery</h5>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100">
              <img
                className="card-img-top img-fluid"
                src="https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt=""
                height={160}
              />
              <div className="card-body">
                <h5 className="card-title text-center">Electronics</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;
