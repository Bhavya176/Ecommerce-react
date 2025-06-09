import React, { useState } from "react";
import { Footer, Navbar } from "../components";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import { addUser, deleteAllItemsFromCart } from "../redux/action";
import { useDispatch } from "react-redux";
const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    password: "",
    imgUrl: null, // New state for image
  });
  const [error, setError] = useState("");
  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
    );

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    console.log("data", data);
    return data.secure_url;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const URL = `${process.env.REACT_APP_LOCAL_URL}users/register`;

      let imgUrl = null;

      if (userInfo.imgUrl) {
        // Upload image to Cloudinary
        imgUrl = await handleImageUpload(userInfo.imgUrl);
      }

      // Prepare JSON payload
      const payload = {
        username: userInfo.username,
        email: userInfo.email,
        password: userInfo.password,
        imgUrl,
      };

      const response = await Axios.post(URL, payload, {
        headers: {
          "Content-Type": "application/json", // sending JSON, not FormData
        },
      });

      handleLogout();
      alert(response.data.message);
      setError("");
      setUserInfo({
        username: "",
        email: "",
        password: "",
        imgUrl: null,
      });
      navigate("/login");
    } catch (error) {
      if (!error.response) {
        setError(error.message);
      } else {
        setError(error.response.data.message);
      }
    }
  };
  const handleLogout = () => {
    localStorage.clear();

    dispatch(deleteAllItemsFromCart());

    dispatch(addUser(null));
  };
  const handleImageChange = (e) => {
    setUserInfo((prevState) => ({
      ...prevState,
      imgUrl: e.target.files[0], // Set image state when user selects a file
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
