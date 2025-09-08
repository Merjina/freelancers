import React, { useEffect, useState } from "react";
import { getProjects } from "../service/Api1";
import { useNavigate, Outlet } from "react-router-dom";
import "../styles/ClientDashboard.css";
import PostProject from "./PostProject";
import ChatBox from "./ChatBox";
import { FaUserCircle } from "react-icons/fa";

// Simulated API call to get freelancers
import { getFreelancers } from "../service/UserService"; // You’ll create this

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [showPostProject, setShowPostProject] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [projects, setProjects] = useState([]);
  const [freelancersList, setFreelancersList] = useState([]);

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : {};
  const clientName = user?.fullName || "Client";

  useEffect(() => {
    fetchProjects();
    fetchFreelancers();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    }
  };

  const fetchFreelancers = async () => {
    try {
      const data = await getFreelancers(); // Add backend call for this
      setFreelancersList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching freelancers:", error);
      setFreelancersList([]);
    }
  };

  return (
    <div className="client-dashboard-container">
      <header className="client-header">
        <h1>Client Dashboard</h1>
        <FaUserCircle className="profile-icon" onClick={() => navigate("/profile")} />
      </header>

      <div className="client-content">
        <nav className="client-sidebar">
          <ul>
            <li onClick={() => setShowPostProject(true)}>Post a Project</li>
            <li onClick={() => navigate("viewbids")}>View Bids</li>
            <li onClick={() => navigate("manage-projects")}>Manage Projects</li>
            <li onClick={() => navigate("payment")}>Payment</li>
            <li onClick={() => navigate("payment-history")}>Payment History</li>
            <li onClick={() => navigate("/feedback")}>Feedback</li>
            <li onClick={() => setShowChat(!showChat)}>Chat</li>
          </ul>
        </nav>

        <div className="client-main">
          <h2>Your Projects - {clientName}</h2>

          {showPostProject && (
            <div className="post-project-wrapper">
              <PostProject setShowPostProject={setShowPostProject} fetchProjects={fetchProjects} />
            </div>
          )}

          {showChat && (
            <div className="chat-wrapper">
              <ChatBox
                user={user}
                userRole="client"
                chatUsers={freelancersList}
              />
            </div>
          )}

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
