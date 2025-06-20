import React, { useEffect } from "react";
import { Footer, Navbar } from "../components";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <Navbar />
      <Helmet>
        <title>About Us</title>
        <meta name="description" content="Learn more about our app and team" />
        <meta name="keywords" content="about, company, team, react" />
        <meta name="author" content="Bhavya Savaliya" />
      </Helmet>
      <main className="container py-3">
        <motion.h1
          className="text-center"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
        >
          About Us
        </motion.h1>
        <hr />
        <motion.p
          className="lead text-center"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          At UniversalCart, we are committed to providing a seamless online
          shopping experience. Our platform offers a wide range of products to
          meet your needs, backed by reliable customer support. Whether you're
          looking for the latest gadgets, fashion, or home essentials, we strive
          to deliver quality and convenience at your fingertips.
        </motion.p>

        <motion.section
          className="my-5 text-center"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="mb-4">Watch Our Introduction</h2>
          <div className="ratio ratio-16x9 shadow rounded">
            <iframe
              src="https://res.cloudinary.com/djasa2x44/video/upload/v1749550289/b1sijnfukp4x8yvhyvhk.mp4"
              title="About Our Website"
              allowFullScreen
              style={{ borderRadius: "8px" }}
            />
          </div>
        </motion.section>

        <motion.h2
          className="text-center py-4"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Our Products
        </motion.h2>

        <div className="row">
          {[
            {
              title: "Men's Clothing",
              img: "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=600",
            },
            {
              title: "Women's Clothing",
              img: "https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=600",
            },
            {
              title: "Jewelery",
              img: "https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=600",
            },
            {
              title: "Electronics",
              img: "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600",
            },
          ].map(({ title, img }, i) => (
            <motion.div
              key={title}
              className="col-md-3 col-sm-6 mb-3 px-3"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.25, delay:0 }} // faster duration 
              whileHover={{
                scale: 1.05,
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
              }}
            >
              <article className="card h-100 shadow-sm rounded">
                <img
                  className="card-img-top img-fluid rounded-top"
                  src={img}
                  alt={title}
                  height={160}
                  style={{ objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title text-center">{title}</h5>
                </div>
              </article>
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AboutPage;
