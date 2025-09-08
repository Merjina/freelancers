import React, { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import "../styles/FreelancerDashboard.css";
import { FaUserCircle } from "react-icons/fa";
import ChatBox from "./ChatBox";

// Simulated API call to get clients
import { getClients } from "../service/UserService"; // You’ll add this service

const FreelancerDashboard = () => {
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);
  const [clientsList, setClientsList] = useState([]);

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : {};

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const data = await getClients(); // You need to create this API
      setClientsList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setClientsList([]);
    }
  };

  return (
    <div className="freelancer-dashboard-container">
      <header className="freelancer-header">
        <h1>Freelancer Dashboard</h1>
        <FaUserCircle size={35} className="profile-icon" onClick={() => navigate("/profile")} />
      </header>

      <div className="freelancer-content">
        <nav className="freelancer-sidebar">
          <ul>
            <li onClick={() => navigate("/freelancer-dashboard/project")}>Browse Projects</li>
            <li onClick={() => navigate("/freelancer-dashboard/bids")}>My Bids</li>
            <li onClick={() => navigate("/freelancer-dashboard/ongoing")}>Ongoing Projects</li>
            <li onClick={() => navigate("/freelancer-dashboard/earnings")}>Earnings</li>
            <li onClick={() => setShowChat(!showChat)}>Chat</li>
          </ul>
        </nav>

        <main className="freelancer-main">
          {showChat && (
            <div className="chat-wrapper">
              <ChatBox
                user={user}
                userRole="freelancer"
                chatUsers={clientsList}
              />
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
