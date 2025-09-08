import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaPlusCircle, FaUserTie, FaSearch, FaSignInAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Navbar.css";
import talentHiveLogo from "../assets/logoTalenthive.png"; // Ensure correct path

function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={talentHiveLogo} alt="TalentHive Logo" className="logo me-2" />
          <span className="fw-bold">TalentHive</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {/* Home */}
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center" to="/home">
                <FaHome className="me-1" /> Home
              </Link>
            </li>

            {/* Post Project */}
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center" to="/post-project">
                <FaPlusCircle className="me-1" /> Post Project
              </Link>
            </li>

            {/* Hire Freelancer */}
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center" to="/hire-freelancer">
                <FaUserTie className="me-1" /> Hire Freelancer
              </Link>
            </li>

            {/* Search Bar */}
            <li className="nav-item d-flex align-items-center mx-3">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search freelancers..."
                />
                <button className="btn btn-outline-primary">
                  <FaSearch />
                </button>
              </div>
            </li>

            {/* Login / Signup */}
            <li className="nav-item">
              <Link className="nav-link btn btn-primary text-white d-flex align-items-center" to="/login">
                <FaSignInAlt className="me-1" /> Login / Signup
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
