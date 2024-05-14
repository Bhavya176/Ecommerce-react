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
    image: null, // New state for image
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const URL = `${process.env.REACT_APP_CLIENT_URL}users/register`;

      const formData = new FormData();
      formData.append("username", userInfo.username);
      formData.append("email", userInfo.email);
      formData.append("password", userInfo.password);
      formData.append("image", userInfo.image); // Append image to FormData
      console.log("userInfo", userInfo);
      const response = await Axios.post(
        URL,
        formData, // Use FormData instead of userInfo
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set Content-Type for FormData
          },
        }
      );

      alert(response.data.message);
      setError("");
      setUserInfo({
        username: "",
        email: "",
        password: "",
        image: null, // Reset image state after successful registration
      });
      navigate("/login");
    } catch (error) {
      if (error.response === undefined) {
        setError(error.message);
      } else {
        setError(error.response.data.message);
      }
    }
  };

  const handleImageChange = (e) => {
    setUserInfo((prevState) => ({
      ...prevState,
      image: e.target.files[0], // Set image state when user selects a file
    }));
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Register</h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="form my-3">
                <label htmlFor="Name">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="Name"
                  placeholder="Enter Your Name"
                  value={userInfo.username}
                  onChange={(e) =>
                    setUserInfo((prevState) => ({
                      ...prevState,
                      username: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="form my-3">
                <label htmlFor="Email">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="name@example.com"
                  value={userInfo.email}
                  onChange={(e) =>
                    setUserInfo((prevState) => ({
                      ...prevState,
                      email: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="form  my-3">
                <label htmlFor="Password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  value={userInfo.password}
                  onChange={(e) =>
                    setUserInfo((prevState) => ({
                      ...prevState,
                      password: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="form my-3">
                <label htmlFor="Image">Profile Image</label>
                <input
                  type="file"
                  className="form-control"
                  id="image"
                  onChange={handleImageChange} // Handle image change
                />
              </div>
              <div className="my-3">
                <p>
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-decoration-underline text-info"
                  >
                    Login
                  </Link>{" "}
                </p>
              </div>
              <div className="text-center">
                <button className="my-2 mx-auto btn btn-dark" type="submit">
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
