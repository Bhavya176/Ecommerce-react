import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Footer, Navbar } from "../components";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { FaPen } from "react-icons/fa"; // Importing the Edit icon from React Icons

const Profile = () => {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.userReducer.userInfo);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    imgUrl: null,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const URL = `${process.env.REACT_APP_CLIENT_URL}users/userProfile/${userData.id}`;
        const response = await Axios.get(URL, {
          headers: {
            Authorization: `Bearer ${userData.accessToken}`,
          },
        });
        setUserInfo({
          username: response.data?.username,
          email: response.data?.email,
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",

          imgUrl: response.data?.imgUrl,
        });
      } catch (error) {
        setError("Failed to load user profile");
        console.error(error);
      }
    };

    fetchUserProfile();
  }, [userData]);

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
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for password match (you can add more validations here)
    if (userInfo.newPassword !== userInfo.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }
    if (userInfo.newPassword) {
      if (userInfo.newPassword.length < 6) {
        setError("New password must be at least 6 characters.");
        return;
      }
    }

    try {
      const URL = `${process.env.REACT_APP_CLIENT_URL}users/usersID/${userData.id}`;

      let imgUrl = userInfo.imgUrl; // Default image URL is the current one (no update needed)

      // Upload image if the user has selected a new image
      if (userInfo.imgUrl instanceof File) {
        imgUrl = await handleImageUpload(userInfo.imgUrl); // Upload image first
      }

      const payload = {
        username: userInfo.username,
        email: userInfo.email,
        oldPassword: userInfo.oldPassword, // New password
        newPassword: userInfo.newPassword, // New password
        imgUrl, // Send only the URL
      };

      const response = await Axios.put(URL, payload, {
        headers: {
          Authorization: `Bearer ${userData.accessToken}`,
        },
      });

      alert(response.data.message);
      setError("");
      setUserInfo({
        username: "",
        email: "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        image: null,
      });
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    }
  };

  const handleImageChange = (e) => {
    setUserInfo((prevState) => ({
      ...prevState,
      imgUrl: e.target.files[0], // Save the image file for upload
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
                  {console.log("userInfo.imgUrl", userInfo.imgUrl)}
                  {userInfo.imgUrl ? (
                    <img
                      src={
                        userInfo.imgUrl instanceof Blob
                          ? URL.createObjectURL(userInfo.imgUrl)
                          : `${userInfo?.imgUrl}`
                      }
                      alt="Profile"
                      className="rounded-circle border border-2 border-dark img-fluid"
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

                <div className="form my-3">
                  <label htmlFor="OldPassword">Old Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="oldPassword"
                    placeholder="Enter your old password"
                    value={userInfo.oldPassword}
                    onChange={(e) =>
                      setUserInfo((prevState) => ({
                        ...prevState,
                        oldPassword: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="form my-3">
                  <label htmlFor="NewPassword">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    placeholder="Enter a new password"
                    value={userInfo.newPassword}
                    onChange={(e) =>
                      setUserInfo((prevState) => ({
                        ...prevState,
                        newPassword: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="form my-3">
                  <label htmlFor="ConfirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    placeholder="Confirm your new password"
                    value={userInfo.confirmPassword}
                    onChange={(e) =>
                      setUserInfo((prevState) => ({
                        ...prevState,
                        confirmPassword: e.target.value,
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
