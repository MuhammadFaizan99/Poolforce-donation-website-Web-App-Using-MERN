import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token")); // Check if user is logged in
  const [googleLoggedIn, setGoogleLoggedIn] = useState(false); // Check if user is logged in with Google

  useEffect(() => {
    const googleToken = localStorage.getItem("googleToken");
    if (googleToken) {
      setGoogleLoggedIn(true);
    } else {
      setGoogleLoggedIn(false);
    }
  }, []);

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    // Remove tokens from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("googleToken");

    // Update the logged-in state
    setLoggedIn(false);
    setGoogleLoggedIn(false);

    // Redirect to Sign In
    navigate("/signin");
  };

  return (
    <div className="Navbar-Content">
      <div className="left__Navbar-Content">
        <img src="../../../../images/logo.png" alt="Logo" />
      </div>
      <div className={`center-Content ${menuOpen ? "menu-open" : ""}`}>
        <nav>
          <ul>
            <li>
              <Link
                to="/"
                className={location.pathname === "/" ? "active" : ""}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/faq"
                className={location.pathname === "/faq" ? "active" : ""}
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                to="/blogs"
                className={location.pathname === "/blogs" ? "active" : ""}
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={location.pathname === "/about" ? "active" : ""}
              >
                About Us
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className={`right-Content ${menuOpen ? "menu-open" : ""}`}>
      {loggedIn || googleLoggedIn ? (
          // If user is logged in, show Logout button
          <div className="signup__right-Content">
            <button  onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          // If user is not logged in, show Login and Sign Up buttons
          <div className="login-signup__right-Content">
            <div className="login__right-Content">
              <Link to="/signin">Login</Link>
            </div>
            <div className="signup__right-Content">
              <button onClick={() => navigate("/signup")}>Sign Up</button>
            </div>
          </div>
        )}
      </div>

      <div
        className={`hamburger-menu ${menuOpen ? "open" : ""}`}
        onClick={handleMenuClick}
      >
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
    </div>
  );
}
