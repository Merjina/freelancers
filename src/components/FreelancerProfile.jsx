import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/FreelancerProfile.css";
import { useNavigate } from "react-router-dom";

const FreelancerProfile = () => {
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:8081/api/auth/freelancer/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile(response.data);
            } catch (error) {
                console.error("Error fetching freelancer profile", error);
            }
        };
        fetchProfile();
    }, []);

    if (!profile) {
        return <p>Loading...</p>;
    }

    return (
        <div className="freelancer-profile-container">
            <h2>Freelancer Profile</h2>
            <div className="profile-details">
                <p><strong>Full Name:</strong> {profile.fullName}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Phone:</strong> {profile.phone}</p>
                <p><strong>Role:</strong> {profile.role}</p>
                <p><strong>Skill:</strong> {profile.skill}</p>
            </div>
            <button className="edit-profile-btn" onClick={() => navigate("/freelancer-dashboard/edit-profile")}>
                Edit Profile
            </button>
        </div>
    );
};

export default FreelancerProfile;
