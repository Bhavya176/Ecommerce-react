import React, { useState } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import { Footer, Navbar } from "../components";
import { Buffer } from "buffer";
import { addUser, deleteAllItemsFromCart } from "../redux/action";
import { useDispatch, useSelector } from "react-redux";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userReducer.userInfo);
  // Check if user info exists in localStorage on component mount

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const URL = `${process.env.REACT_APP_CLIENT_URL}users/login`;

      const response = await Axios.post(URL, {
        email,
        password,
      });
      const userData = response.data.userInfo;
      dispatch(addUser(userData));
      alert(response.data.message);
      setError("");
    } catch (error) {
      if (error.response === undefined) {
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

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Login</h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-6 offset-md-3 col-lg-4 offset-lg-4 col-sm-8 offset-sm-2">
            {userData ? (
              <div className="text-center">
                {userData?.img && (
                  <img
                    src={`data:${
                      userData?.img.contentType
                    };base64,${Buffer.from(userData?.img.data).toString(
                      "base64"
                    )}`} // Render image
                    alt="Profile"
                    className="rounded-circle mb-3"
                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                  />
                )}
                <h4>{userData?.username}</h4>
                <p>{userData?.email}</p>

                <button className="btn btn-danger" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
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
                    </Link>{" "}
                  </p>
                </div>
                <div className="text-center">
                  <button className="my-2 mx-auto btn btn-dark" type="submit">
                    Login
                  </button>
                </div>
              </form>
            )}
            {error && <p className="text-danger">{error}</p>}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
