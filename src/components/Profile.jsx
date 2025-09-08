import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import "../styles/Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      alert("Unauthorized! Please log in.");
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        alert("Failed to load profile");
      }
    };

    fetchProfile();
  }, [token, navigate]);

  return (
    <div className="profile-container">
      <div className="profile-card">
        <FaUserCircle className="profile-icon" size={100} />
        <h2>User Profile</h2>
        {user ? (
          <>
            <p><strong>Name:</strong> {user.fullName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone || "N/A"}</p>
            <p><strong>Role:</strong> {user.role}</p>
            
            <button className="back-btn" onClick={() => navigate("/client-dashboard")}>
              Back to Dashboard
            </button>
          </>
        ) : (
          <p className="loading-text">Loading profile...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
