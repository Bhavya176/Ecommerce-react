import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSpring, useTrail, animated } from "@react-spring/web";

const Navbar = () => {
  const state = useSelector((state) => state.handleCart);

  // Navbar slide-in animation
  const navAnimation = useSpring({
    from: { transform: "translateY(-100%)", opacity: 0 },
    to: { transform: "translateY(0%)", opacity: 1 },
    config: { tension: 200, friction: 20 },
  });

  // Logo bounce-in animation
  const logoAnimation = useSpring({
    from: { transform: "scale(0.8)", opacity: 0 },
    to: { transform: "scale(1)", opacity: 1 },
    config: { tension: 180, friction: 12 },
    delay: 300,
  });

  // Hover animation styles (to be applied with inline styles)
  const hoverStyle = {
    transition: "transform 0.1s ease",
  };

  const navItems = [
    { label: "Home", to: "/" },
    { label: "Products", to: "/product" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "Chat", to: "/chat" },
    { label: "TicToeGame", to: "/TicToeGame" },
    { label: "Profile", to: "/profile" },
  ];

  // Trail animation for nav links
  const trail = useTrail(navItems.length, {
    from: { opacity: 0, transform: "translateY(-10px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    delay: 300,
    config: { mass: 1, tension: 200, friction: 18 },
  });

  return (
    <animated.nav
      className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top"
      style={navAnimation}
    >
      <div className="container py-0">
        <animated.div style={logoAnimation}>
          <NavLink
            className="fw-bold fs-4 px-2"
            to="/"
            style={{
              fontFamily: "cursive",
              color: "white",
              textDecorationLine: "none",
            }}
          >
            Universal Cart
          </NavLink>
        </animated.div>

        <button
          className="navbar-toggler mx-2"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav m-auto my-2 text-center">
            {trail.map((style, index) => (
              <animated.li className="nav-item" key={navItems[index].label} style={style}>
                <NavLink
                  className="nav-link"
                  to={navItems[index].to}
                  style={hoverStyle}
                  onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                >
                  {navItems[index].label}
                </NavLink>
              </animated.li>
            ))}
          </ul>

          <div className="buttons text-center">
            <NavLink
              to="/login"
              className="btn btn-outline-white m-2"
              style={{
                color: "white",
                ...hoverStyle,
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              <i className="fa fa-sign-in-alt mr-1"></i> Login
            </NavLink>

            <NavLink
              to="/register"
              className="btn btn-outline-white m-2"
              style={{
                color: "white",
                ...hoverStyle,
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              <i className="fa fa-user-plus mr-1"></i> Register
            </NavLink>

            <NavLink
              to="/cart"
              className="btn btn-outline-white m-2"
              style={{
                color: "white",
                ...hoverStyle,
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              <i className="fa fa-cart-shopping mr-1"></i> Cart ({state.length})
            </NavLink>
          </div>
        </div>
      </div>
    </animated.nav>
  );
};

export default Navbar;
