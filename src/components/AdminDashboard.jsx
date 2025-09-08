import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom"; // Import navigate and location from react-router-dom
import "../styles/AdminDashboard.css";
import axios from "axios";

const AdminDashboard = () => {
  const navigate = useNavigate();  // Initialize navigate
  const location = useLocation();  // Initialize location

  const [counts, setCounts] = useState({
    totalUsers: 0,
    totalFreelancers: 0,
    totalClients: 0
  });

  useEffect(() => {
    const token = localStorage.getItem("token"); // Get JWT token from localStorage

    if (!token) {
      console.error("No token found. User is not authenticated.");
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`
    };

    axios.get("http://localhost:8081/api/auth/count", { headers })
      .then(response => {
        setCounts(response.data);
      })
      .catch(error => {
        console.error("Error fetching counts:", error);
      });
  }, []);

  return (
    <div className="admin-dashboard-container">
      {/* Header */}
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
      </header>

      {/* Main Content Area */}
      <div className="admin-content">
        {/* Sidebar */}
        <nav className="admin-sidebar">
          <ul>
            <li onClick={() => navigate("/admin/userlist")}>User Management</li>
            <li onClick={() => navigate("/admin/transactions")}>Transaction Monitoring</li>

            <li onClick={() => navigate("/admin/feedback")}>Feedback & Complaints</li>
          </ul>
        </nav>

        {/* Main Section */}
        <main className="admin-main">
          {location.pathname === "/admin" && (
            <div className="stats-container">
              <div className="stats-box">
                <h3>Total Signups</h3>
                <p>{counts.totalUsers}</p>
              </div>

              <div className="stats-box freelancer">
                <h3>Total Freelancers</h3>
                <p>{counts.totalFreelancers}</p>
              </div>

              <div className="stats-box client">
                <h3>Total Clients</h3>
                <p>{counts.totalClients}</p>
              </div>
            </div>
          )}
          <Outlet /> {/* This will render UserList when navigating to /admin/userlist */}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
