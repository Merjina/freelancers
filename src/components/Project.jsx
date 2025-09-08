import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "../styles/FreelancerDashboard.css";

// API URLs
const PROJECTS_API_URL = "http://localhost:8081/api/projects";
const BIDS_API_URL = "http://localhost:8081/api/bids";

// Get JWT headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("⚠️ No token found! Redirecting to login...");
    alert("Session expired. Please log in again.");
    window.location.href = "/login";
    throw new Error("Unauthorized - No Token");
  }

  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

// Fetch projects from backend
const getProjects = async () => {
  try {
    const response = await axios.get(PROJECTS_API_URL, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching projects:", error.response?.data || error.message);
    throw error;
  }
};

// Place a bid for a project
const placeBid = async (bid) => {
  try {
    const response = await axios.post(`${BIDS_API_URL}/place`, bid, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error placing bid:", error);
    throw error;
  }
};

// Decode freelancer name from token
const getFreelancerNameFromToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      return decoded.fullName || decoded.sub || "Freelancer"; // Ensure fallback to email if name is missing
    } catch (error) {
      console.error("Error decoding token:", error);
      return "Freelancer";
    }
  }
  return "Freelancer";
};

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [bidAmounts, setBidAmounts] = useState({}); // Store bid amounts by project id
  const [freelancerName, setFreelancerName] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
    const name = user?.fullName || getFreelancerNameFromToken();
    setFreelancerName(name);

    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleBidAmountChange = (projectId, value) => {
    setBidAmounts((prevBidAmounts) => ({
      ...prevBidAmounts,
      [projectId]: value,
    }));
  };

  const handlePlaceBid = async (project) => {
    const bidAmount = bidAmounts[project.id];

    if (!bidAmount) {
      alert("Please enter a bid amount");
      return;
    }

    // Decode email from token
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const freelancerEmail = decoded.sub; // Assuming email is stored in `sub`

    const bidData = {
      project,
      freelancerName,
      freelancerEmail, // ✅ Add this field
      bidAmount: parseFloat(bidAmount),
    };

    try {
      const result = await placeBid(bidData);
      if (result) {
        alert("Bid placed successfully!");
        setBidAmounts((prev) => ({ ...prev, [project.id]: "" })); // Reset the bid input after placing the bid
      } else {
        alert("Failed to place bid.");
      }
    } catch (error) {
      console.error("Error placing bid:", error);
      alert("Failed to place bid. Please try again.");
    }
  };

  return (
    <div className="freelancer-dashboard-container">
      <header className="freelancer-header">
        <h2 className="text-white bg-dark p-2">Welcome, {freelancerName}</h2>
      </header>

      <main className="freelancer-main">
        <section className="freelancer-projects">
          <h2>Available Projects</h2>
          <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
            {projects.length > 0 ? (
              projects.map((project) => (
                <li key={project.id} className="mb-4 p-3 border rounded shadow">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <p><strong>Budget:</strong> ${project.budget}</p>
                  <p><strong>Deadline:</strong> {project.deadline}</p>
                  <input
                    type="number"
                    placeholder="Enter bid amount"
                    className="form-control w-50 my-2"
                    value={bidAmounts[project.id] || ""}
                    onChange={(e) => handleBidAmountChange(project.id, e.target.value)}
                  />
                  <button className="btn btn-primary" onClick={() => handlePlaceBid(project)}>
                    Place Bid
                  </button>
                </li>
              ))
            ) : (
              <p>No projects available.</p>
            )}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Project;
