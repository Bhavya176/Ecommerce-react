import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Footer, Navbar } from "../components";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { FaPen } from "react-icons/fa";
import { useSpring, animated } from "@react-spring/web";

const Profile = () => {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.userReducer.userInfo);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    imgUrl: null,
  });
  const [error, setError] = useState("");

  // Loader animation: fade + scale
  const loaderAnimation = useSpring({
    opacity: loading ? 1 : 0,
    transform: loading ? `scale(1)` : `scale(0.8)`,
    config: { tension: 200, friction: 20 },
  });

  // Profile Image animation: scale-up + glow shadow on imgUrl change
  const imgAnimation = useSpring({
    from: { transform: "scale(0.8)", boxShadow: "0px 0px 0px rgba(0,0,0,0)" },
    to: {
      transform: "scale(1)",
      boxShadow: userInfo.imgUrl
        ? "0 0 15px 5px rgba(0, 123, 255, 0.7)" // blue glow effect
        : "0px 0px 0px rgba(0,0,0,0)",
    },
    config: { tension: 180, friction: 12 },
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
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

    if (userInfo.newPassword !== userInfo.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }
    if (userInfo.newPassword && userInfo.newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      const URL = `${process.env.REACT_APP_CLIENT_URL}users/usersID/${userData.id}`;
      let imgUrl = userInfo.imgUrl;

      if (userInfo.imgUrl instanceof File) {
        imgUrl = await handleImageUpload(userInfo.imgUrl);
      }

      const payload = {
        username: userInfo.username,
        email: userInfo.email,
        oldPassword: userInfo.oldPassword,
        newPassword: userInfo.newPassword,
        imgUrl,
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
        imgUrl: null,
      });
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    setUserInfo((prevState) => ({
      ...prevState,
      imgUrl: e.target.files[0],
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
        <div className="container my-3 py-3 position-relative">
          <h1 className="text-center">Profile</h1>
          <hr />

          {loading && (
            <animated.div
              style={{
                ...loaderAnimation,
                position: "fixed",
                top: "50%",
                left: "50%",
                transformOrigin: "center",
                transform: loaderAnimation.transform.to(
                  (t) => `${t} translate(-50%, -50%)`
                ),
                backgroundColor: "rgba(0,0,0,0.6)",
                padding: "20px",
                borderRadius: "10px",
                color: "white",
                zIndex: 1000,
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "1.2rem",
              }}
            >
              Loading...
            </animated.div>
          )}

          <div className="row my-4 h-100" style={{ opacity: loading ? 0.5 : 1 }}>
            <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
              <form onSubmit={handleSubmit}>
                <div className="d-flex justify-content-center position-relative mb-3">
                  {userInfo.imgUrl ? (
                    <animated.img
                      style={{
                        ...imgAnimation,
                        width: "200px",
                        height: "200px",
                        borderRadius: "50%",
                        border: "2px solid black",
                        objectFit: "cover",
                      }}
                      src={
                        userInfo.imgUrl instanceof Blob
                          ? URL.createObjectURL(userInfo.imgUrl)
                          : `${userInfo?.imgUrl}`
                      }
                      alt="Profile"
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

                {/* ...rest of your form inputs */}
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
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
                  />
                </div>

                <div className="form my-3" style={{ display: "none" }}>
                  <label htmlFor="Image">Profile Image</label>
                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    onChange={handleImageChange}
                    disabled={loading}
                  />
                </div>

                <div className="text-center">
                  <button
                    className="my-2 mx-auto btn btn-dark"
                    type="submit"
                    disabled={loading}
                  >
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
