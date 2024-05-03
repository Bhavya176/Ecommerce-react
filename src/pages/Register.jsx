import React, { useState } from "react";
import { Footer, Navbar } from "../components";
import { Link, useNavigate } from "react-router-dom";

import Axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const URL = process.env.REACT_APP_CLIENT_URL + "users" + "/register";

      const response = await Axios.post(URL, userInfo);
      alert(response.data.message);
      setError("");
      setUserInfo({ username: "", email: "", password: "" });
      navigate("/login");
    } catch (error) {
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
        <h1 className="text-center">Register</h1>
        <hr />
        <div class="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form onSubmit={handleSubmit}>
              <div class="form my-3">
                <label for="Name">Full Name</label>
                <input
                  type="text" // Change type to "text"
                  class="form-control"
                  id="Name"
                  placeholder="Enter Your Name"
                  value={userInfo.username} // Use userInfo.username as value
                  onChange={(e) =>
                    setUserInfo((prevState) => ({
                      ...prevState, // Spread previous state
                      username: e.target.value, // Update username field
                    }))
                  }
                />
              </div>
              <div class="form my-3">
                <label for="Email">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
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
                <label for="Password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  value={userInfo.password} // Use userInfo.username as value
                  onChange={(e) =>
                    setUserInfo((prevState) => ({
                      ...prevState, // Spread previous state
                      password: e.target.value, // Update username field
                    }))
                  }
                />
              </div>
              <div className="my-3">
                <p>
                  Already has an account?{" "}
                  <Link
                    to="/login"
                    className="text-decoration-underline text-info"
                  >
                    Login
                  </Link>{" "}
                </p>
              </div>
              <div className="text-center">
                <button class="my-2 mx-auto btn btn-dark" type="submit">
                  Register
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

export default Register;
