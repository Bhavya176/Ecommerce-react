import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Footer, Navbar } from "../components";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { Buffer } from "buffer";
import { FaPen } from "react-icons/fa"; // Importing the Edit icon from React Icons

const Profile = () => {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.userReducer.userInfo);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    password: "",
    image: null, // New state for image
  });
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await Axios.get(
          `${process.env.REACT_APP_CLIENT_URL}users/userProfile/${userData.id}`
        );
        setUserInfo({
          username: response.data?.username,
          email: response.data?.email,
          password: "",
          image: response.data?.img, // New state for image
        });
      } catch (error) {
        setError("Failed to load user profile");
        console.error(error);
      }
    };

    fetchUserProfile();
  }, [userData]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const URL = `${process.env.REACT_APP_CLIENT_URL}users/usersID/${userData.id}`;
      const formData = new FormData();
      formData.append("username", userInfo.username);
      formData.append("email", userInfo.email);
      formData.append("password", userInfo.password);
      if (userInfo.image) {
        formData.append("image", userInfo.image); // Append image to FormData
      }

      const response = await Axios.put(
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
  useEffect(() => {
    if (userData === null) {
      navigate("*");
    } else {
      setIsAdmin(true);
    }
  }, [userData, navigate]);
  return (
    <>
      <Navbar />
      {isAdmin === true ? (
        <div className="container my-3 py-3">
          <h1 className="text-center">Profile</h1>
          <hr />
          <div className="row my-4 h-100">
            <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
              <form onSubmit={handleSubmit}>
                <div className="d-flex justify-content-center position-relative mb-3">
                  {userInfo.image ? (
                    <img
                      src={
                        userInfo.image instanceof Blob
                          ? URL.createObjectURL(userInfo.image)
                          : `data:${
                              userInfo?.image.contentType
                            };base64,${Buffer.from(
                              userInfo?.image.data
                            ).toString("base64")}`
                      }
                      alt="Profile"
                      className="rounded-circle border border-2 border-dark img-fluid"
                      // className="rounded-circle"
                      style={{ width: "200px", height: "200px" }}
                    />
                  ) : (
                    <div
                      className="rounded-circle d-flex justify-content-center align-items-center"
                      style={{
                        width: "200px",
                        height: "200px",
                        backgroundColor: "#ccc",
                      }}
                    >
                      <span>No Image</span>
                    </div>
                  )}
                  <label
                    htmlFor="image"
                    className="position-absolute"
                    style={{
                      top: "0",
                      right: "50px",
                      backgroundColor: "#000000a0",
                      padding: "6px",
                      borderRadius: "50%",
                      cursor: "pointer",
                    }}
                  >
                    <FaPen color="white" size={20} />
                  </label>
                </div>

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

                {/* Hide image input if an image is uploaded */}

                <div className="form my-3" style={{ display: "none" }}>
                  <label htmlFor="Image">Profile Image</label>
                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    onChange={handleImageChange} // Handle image change
                  />
                </div>

                <div className="text-center">
                  <button className="my-2 mx-auto btn btn-dark" type="submit">
                    Update Profile
                  </button>
                </div>
              </form>
              {error && <p className="text-danger">{error}</p>}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      <Footer />
    </>
  );
};

export default Profile;
