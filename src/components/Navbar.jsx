import React, { useState,useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSpring, useTrail, animated } from "@react-spring/web";

const Navbar = () => {
  const state = useSelector((state) => state.handleCart);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
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

  // Responsive toggler handler
  const handleToggle = () => setIsOpen(!isOpen);

  // Close menu on link click (for mobile)
  const handleNavLinkClick = () => setIsOpen(false);

  return (
    <animated.nav
      className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top"
      style={navAnimation}
    >
      <div className="container-fluid py-0">
        <animated.div style={logoAnimation}>
          <NavLink
            className="fw-bold fs-4 px-2"
            to="/"
            style={{
              fontFamily: "sans-serif",
              fontWeight: "bold",
              textDecorationLine: "none",
              fontSize: "24px",
              textTransform: "full-size-kana",
              background: "linear-gradient(90deg, #3f87a6, #ebf8e1, #f69d3c)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "0.3em",
              color: "transparent",
            }}
          >
            Universal Cart
          </NavLink>
        </animated.div>

        <button
  type="button"
  aria-label="Toggle navigation"
  aria-expanded={isOpen}
  onClick={handleToggle}
  style={{
    backgroundColor: "transparent",
    border: "1px solid rgba(255, 255, 255, 0.5)",
    borderRadius: "4px",
    padding: "6px 10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  }}
>
  <span
    style={{
      display: "inline-block",
      width: "1.5em",
      height: "1.5em",
      backgroundImage:
        "url(\"data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba%28255, 255, 255, 0.5%29' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E\")",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "100% 100%",
    }}
  ></span>
</button>


        <div
          className={`collapse navbar-collapse${isOpen ? " show" : ""}`}
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav mx-auto my-2 text-center">
            {trail.map((style, index) => (
              <animated.li
                className="nav-item"
                key={navItems[index].label}
                style={style}
              >
                <NavLink
                  className="nav-link"
                  to={navItems[index].to}
                  onClick={handleNavLinkClick}
                  style={{ transition: "transform 0.1s ease" }}
                  onMouseEnter={(e) =>
                    (e.target.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.transform = "scale(1)")
                  }
                >
                  {navItems[index].label}
                </NavLink>
              </animated.li>
            ))}
          </ul>

          <div className="d-flex flex-column flex-lg-row align-items-center ms-lg-3">
            <NavLink
              to="/login"
              className="btn btn-outline-light m-2"
              style={{ transition: "transform 0.1s ease" }}
              onClick={handleNavLinkClick}
              onMouseEnter={(e) =>
                (e.target.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.target.style.transform = "scale(1)")
              }
            >
              <i className="fa fa-sign-in-alt me-1"></i> Login
            </NavLink>

            <NavLink
              to="/register"
              className="btn btn-outline-light m-2"
              style={{ transition: "transform 0.1s ease" }}
              onClick={handleNavLinkClick}
              onMouseEnter={(e) =>
                (e.target.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.target.style.transform = "scale(1)")
              }
            >
              <i className="fa fa-user-plus me-1"></i> Register
            </NavLink>

            <NavLink
              to="/cart"
              className="btn btn-outline-light m-2"
              style={{ transition: "transform 0.1s ease" }}
              onClick={handleNavLinkClick}
              onMouseEnter={(e) =>
                (e.target.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.target.style.transform = "scale(1)")
              }
            >
              <i className="fa fa-cart-shopping me-1"></i> Cart ({state.length})
            </NavLink>
          </div>
        </div>
      </div>
    </animated.nav>
  );
};

export default Navbar;