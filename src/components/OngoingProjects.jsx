import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const OngoingProjects = () => {
  const [bids, setBids] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const BIDS_API = "http://localhost:8080/api/bids";

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: { Authorization: `Bearer ${token}` },
    };
  };

  const handleStatusUpdate = async (bidId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8081/api/bids/${bidId}/status?status=${newStatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update bid list in UI
      setBids((prev) =>
        prev.map((bid) =>
          bid.id === bidId ? { ...bid, status: newStatus } : bid
        )
      );
    } catch (err) {
      console.error("Failed to update bid status:", err);
      alert("Status update failed.");
    }
  };

  const fetchApprovedBids = async (email) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BIDS_API}/by-freelancer?email=${email}`,
        getAuthHeaders()
      );
      const filteredBids = response.data.filter((bid) =>
        ["APPROVED", "PROCESSING", "COMPLETED"].includes(bid.status)
      );
      setBids(filteredBids);
    } catch (err) {
      console.error("❌ Error fetching bids:", err);
      setError("Failed to load ongoing projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please login.");
      window.location.href = "/login";
      return;
    }

    const decoded = jwtDecode(token);
    const freelancerEmail = decoded.sub;
    fetchApprovedBids(freelancerEmail);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Ongoing Projects</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && bids.length === 0 && <p>No ongoing projects yet.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bids.map((bid) => (
          <div
            key={bid.id}
            className="bg-white shadow rounded-xl p-4 border border-gray-300"
          >
            <h3 className="text-xl font-semibold mb-2">
              {bid.project?.title || "Untitled Project"}
            </h3>

            <p><strong>Project ID:</strong> {bid.project?.id || "N/A"}</p>
            <p><strong>Client Email:</strong> {bid.clientEmail}</p>
            <p><strong>Freelancer Email:</strong> {bid.freelancerEmail}</p>
            <p><strong>Bid Amount:</strong> ₹{bid.bidAmount}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`font-medium ${
                  bid.status === "APPROVED"
                    ? "text-yellow-500"
                    : bid.status === "PROCESSING"
                    ? "text-blue-500"
                    : "text-green-600"
                }`}
              >
                {bid.status}
              </span>
            </p>

            {/* Mark as Processing Button */}
            <button
              disabled={bid.status !== "APPROVED"}
              className={`px-3 py-1 rounded mr-2 mt-2 ${
                bid.status !== "APPROVED"
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to mark this project as PROCESSING?"
                  )
                ) {
                  handleStatusUpdate(bid.id, "PROCESSING");
                }
              }}
            >
              Mark as Processing
            </button>

            {/* Mark as Completed Button */}
            <button
              disabled={bid.status !== "PROCESSING"}
              className={`px-3 py-1 rounded mt-2 ${
                bid.status !== "PROCESSING"
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to mark this project as COMPLETED?"
                  )
                ) {
                  handleStatusUpdate(bid.id, "COMPLETED");
                }
              }}
            >
              Mark as Completed
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OngoingProjects;
