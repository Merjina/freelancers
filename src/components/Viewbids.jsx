import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';  // Update the import here

const ViewBids = () => {
  const [bids, setBids] = useState([]);
  const [clientEmail, setClientEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const BIDS_API_URL = 'http://localhost:8081/api/bids';

  // Helper function to get auth headers with JWT token
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };
  const handleStatusUpdate = async (bidId, newStatus) => {
    try {
      const response = await axios.put(
        `${BIDS_API_URL}/${bidId}/status?status=${newStatus}`,
        {},
        getAuthHeaders()
      );
      // Update UI immediately
      setBids((prevBids) =>
        prevBids.map((bid) =>
          bid.id === bidId ? { ...bid, status: newStatus } : bid
        )
      );
    } catch (err) {
      console.error(`❌ Failed to update bid status:`, err);
      alert('Failed to update status. Please try again.');
    }
  };
  
  // Fetch bids for the logged-in user
  const fetchBids = async (email) => {
    setLoading(true);
    setError('');
    try {
      console.log('📡 Fetching bids for email:', email);
      const response = await axios.get(
        `${BIDS_API_URL}/by-client?email=${encodeURIComponent(email)}`,
        getAuthHeaders()
      );
      console.log('📥 Bids fetched:', response.data);
      setBids(response.data);  // Set the fetched bids
    } catch (err) {
      console.error('❌ Error fetching bids:', err.response ? err.response.data : err);
      setError('Failed to fetch bids. Please try again later.');
    } finally {
      setLoading(false);  // Stop loading after the request finishes
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Session expired. Please login again.');
      window.location.href = '/login';
      return;
    }

    try {
      const decoded = jwtDecode(token);  // Use jwtDecode here
      const email = decoded.sub;  // Extract the email from the token
      console.log('📧 Decoded email from token:', email);
      setClientEmail(email);
      fetchBids(email);  // Fetch the bids for the logged-in user
    } catch (err) {
      console.error('❌ Invalid token:', err);
      setError('Invalid token. Please log in again.');
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Bids for Your Projects</h2>

      {/* Display loading indicator while fetching bids */}
      {loading && <p className="text-gray-600">Loading bids...</p>}

      {/* Display error if there's an issue fetching bids */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Display message if no bids are available */}
      {bids.length === 0 && !loading && !error && (
        <p className="text-gray-600">No bids found.</p>
      )}

      {/* Display bids in a grid if available */}
      {bids.length > 0 && !loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bids.map((bid) => (
            <div
              key={bid.id}
              className="bg-white shadow-lg rounded-xl p-4 border border-gray-200"
            >
              <h3 className="text-xl font-semibold mb-2">
                {bid.project?.title || 'Untitled Project'}
              </h3>
              <p className="text-gray-700 mb-1">
                <strong>Freelancer:</strong> {bid.freelancerEmail}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Bid Amount:</strong> ₹{bid.bidAmount}
              </p>
             
             
              <p className="text-gray-700 mb-1">
  <strong>Project ID:</strong> {bid.project?.id}
</p>
<p className="text-gray-700 mb-1">
  <strong>Project Title:</strong> {bid.project?.title || 'Untitled Project'}
</p>
<p className="text-gray-700 mb-1">
  <strong>Client Email:</strong> {bid.clientEmail}
</p>

<p className="text-gray-700 mb-1">
  <strong>Bid Amount:</strong> ₹{bid.bidAmount}
</p>
<p className="text-gray-700 mb-1">
  <strong>Status:</strong> {bid.status}
</p>

<div className="flex gap-2 mt-2">
  <button
    onClick={() => handleStatusUpdate(bid.id, 'APPROVED')}
    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
    disabled={bid.status === 'APPROVED'}
  >
    Approve
  </button>
  <button
    onClick={() => handleStatusUpdate(bid.id, 'REJECTED')}
    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
    disabled={bid.status === 'REJECTED'}
  >
    Reject
  </button>
</div>


            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewBids;
