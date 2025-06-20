import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import { Footer, Navbar } from "../components";
import { addUser, deleteAllItemsFromCart } from "../redux/action";
import { useDispatch, useSelector } from "react-redux";
import { useSpring, animated } from "@react-spring/web";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    password: "",
    imgUrl: null,
  });

  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userReducer.userInfo);

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
          password: "",
          imgUrl: response.data?.imgUrl,
        });
      } catch (error) {
        setError("Failed to load user profile");
        console.error(error);
      }
    };
    if (userData) {
      fetchUserProfile();
    }
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const URL = `${process.env.REACT_APP_CLIENT_URL}users/login`;
      const response = await Axios.post(URL, { email, password });

      const userData = {
        ...response.data.userInfo,
        accessToken: response.data.accessToken,
      };

      dispatch(addUser(userData));
      alert(response.data.message);
      setError("");
    } catch (error) {
      if (error.response === undefined) {
        setError(error.message);
      } else {
        setError(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    dispatch(deleteAllItemsFromCart());
    dispatch(addUser(null));
  };

  // Animations
  const pageAnimation = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 500 },
  });

  const loginFormAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(30px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    config: { tension: 220, friction: 20 },
  });

  const profileAnimation = useSpring({
    from: { opacity: 0, transform: "scale(0.9)" },
    to: { opacity: 1, transform: "scale(1)" },
    config: { duration: 400 },
  });

  const errorAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(-10px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    config: { duration: 300 },
  });

  const spinnerAnimation = useSpring({
    loop: true,
    to: [{ transform: "rotate(360deg)" }],
    from: { transform: "rotate(0deg)" },
    config: { duration: 1000 },
  });

  const imageFadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 200,
    config: { duration: 800 },
  });

  const buttonHover = useSpring({
    from: { transform: "scale(1)" },
    to: async (next) => {
      while (1) {
        await next({ transform: "scale(1.03)" });
        await next({ transform: "scale(1)" });
      }
    },
    config: { duration: 1200 },
  });

  return (
    <>
      <Navbar />
      <animated.div style={pageAnimation}>
        <div className="container my-3 py-3">
          <h1 className="text-center">Login</h1>
          <hr />
          <div className="row my-4 h-100">
            <div className="col-md-6 offset-md-3 col-lg-4 offset-lg-4 col-sm-8 offset-sm-2">
              {userData ? (
                <animated.div className="text-center" style={profileAnimation}>
                  {userInfo?.imgUrl && (
                    <animated.img
                      src={`${userInfo.imgUrl}`}
                      alt="Profile"
                      className="rounded-circle mb-3"
                      style={{
                        width: "200px",
                        height: "200px",
                        ...imageFadeIn,
                      }}
                    />
                  )}
                  <h4>{userInfo?.username}</h4>
                  <p>{userInfo?.email}</p>
                  <animated.button
                    className="btn btn-danger"
                    onClick={handleLogout}
                    style={buttonHover}
                  >
                    Logout
                  </animated.button>
                </animated.div>
              ) : (
                <animated.form
                  style={loginFormAnimation}
                  onSubmit={handleSubmit}
                >
                  <div className="my-3">
                    <label htmlFor="email">Email address</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="my-3">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="my-3">
                    <p>
                      New Here?{" "}
                      <Link
                        to="/register"
                        className="text-decoration-underline text-info"
                      >
                        Register
                      </Link>
                    </p>
                  </div>
                  <div className="text-center">
                    <animated.button
                      className="my-2 mx-auto btn btn-dark"
                      type="submit"
                      style={buttonHover}
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "Login"}
                    </animated.button>
                  </div>
                </animated.form>
              )}

              {loading && (
                <div className="text-center my-3">
                  <animated.div
                    style={{
                      ...spinnerAnimation,
                      display: "inline-block",
                      width: "30px",
                      height: "30px",
                      border: "4px solid #333",
                      borderTop: "4px solid transparent",
                      borderRadius: "50%",
                    }}
                  />
                </div>
              )}

              {error && (
                <animated.p className="text-danger mt-3" style={errorAnimation}>
                  {error}
                </animated.p>
              )}
            </div>
          </div>
        </div>
      </animated.div>
      <Footer />
    </>
  );
};

export default Login;
