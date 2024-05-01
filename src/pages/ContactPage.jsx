import React, { useState } from "react";
import { Footer, Navbar } from "../components";
import Axios from "axios";
const ContactPage = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: null,
    message: "",
  });
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.post("https://nodeapi-dzib.onrender.com/contacts",userInfo);

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
      <div className="container my-3 py-3">
        <h1 className="text-center">Contact Us</h1>
        <hr />
        <div class="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form onSubmit={handleSubmit}>
              <div class="form my-3">
                <label for="Name">Name</label>
                <input
                  type="name"
                  class="form-control"
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
              <div class="form my-3">
                <label for="phone">Phone</label>
                <input
                  type="phone"
                  class="form-control"
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
              <div class="form my-3">
                <label for="Email">Email</label>
                <input
                  type="email"
                  class="form-control"
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
              <div class="form  my-3">
                <label for="Password">Message</label>
                <textarea
                  rows={5}
                  class="form-control"
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
                <button class="my-2 px-4 mx-auto btn btn-dark" type="submit">
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
