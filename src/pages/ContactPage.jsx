import React, { useState } from "react";
import { Footer, Navbar } from "../components";
import Axios from "axios";
const ContactPage = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: undefined,
    message: "",
  });
  const [error, setError] = useState("");
  window.scrollTo({ top: 0, behavior: "smooth" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const URL = process.env.REACT_APP_LOCAL_URL;

      const response = await Axios.post(URL, userInfo);

      alert(response.data.message);
      setUserInfo({ name: "", email: "", phone: "", message: "" });
      setError("");
    } catch (error) {
      console.log("error", error);
      if (error.response === undefined) {
        setError(error.message);
      } else {
        setError(error.response.data.message);
      }
    }
  };
  return (
    <>
      <Navbar />
      <div className="container  py-3">
        <h1 className="text-center">Contact Us</h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="form my-3">
                <label htmlFor="Name">Name</label>
                <input
                  type="name"
                  className="form-control"
                  id="Name"
                  placeholder="Enter your name"
                  value={userInfo.name} // Use userInfo.username as value
                  onChange={(e) =>
                    setUserInfo((prevState) => ({
                      ...prevState, // Spread previous state
                      name: e.target.value, // Update username field
                    }))
                  }
                />
              </div>
              <div className="form my-3">
                <label htmlFor="phone">Phone</label>
                <input
                  type="phone"
                  className="form-control"
                  id="Phone"
                  placeholder="1234567890"
                  value={userInfo.phone} // Use userInfo.username as value
                  onChange={(e) =>
                    setUserInfo((prevState) => ({
                      ...prevState, // Spread previous state
                      phone: e.target.value, // Update username field
                    }))
                  }
                />
              </div>
              <div className="form my-3">
                <label htmlFor="Email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="Email"
                  placeholder="name@example.com"
                  value={userInfo.email} // Use userInfo.username as value
                  onChange={(e) =>
                    setUserInfo((prevState) => ({
                      ...prevState, // Spread previous state
                      email: e.target.value, // Update username field
                    }))
                  }
                />
              </div>
              <div className="form  my-3">
                <label htmlFor="Password">Message</label>
                <textarea
                  rows={5}
                  className="form-control"
                  id="Password"
                  placeholder="Enter your message"
                  value={userInfo.message} // Use userInfo.username as value
                  onChange={(e) =>
                    setUserInfo((prevState) => ({
                      ...prevState, // Spread previous state
                      message: e.target.value, // Update username field
                    }))
                  }
                />
              </div>
              <div className="text-center">
                <button
                  className="my-2 px-4 mx-auto btn btn-dark"
                  type="submit"
                >
                  Send
                </button>
              </div>
            </form>
            {error && <p className="text-danger">{error}</p>}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;
