import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const MyBids = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const BIDS_API_URL = 'http://localhost:8081/api/bids';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchMyBids = async (email) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `${BIDS_API_URL}/by-freelancer?email=${encodeURIComponent(email)}`,
        getAuthHeaders()
      );
      console.log('📥 My Bids fetched:', response.data);

      // Optional: filter only APPROVED bids here if needed
      // const approvedBids = response.data.filter(bid => bid.status === 'APPROVED');
      setBids(response.data);
    } catch (err) {
      console.error('❌ Error fetching my bids:', err.response ? err.response.data : err);
      setError('Failed to fetch your bids. Please try again.');
    } finally {
      setLoading(false);
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
      const decoded = jwtDecode(token);
      const email = decoded.sub;
      fetchMyBids(email);
    } catch (err) {
      console.error('❌ Invalid token:', err);
      setError('Invalid token. Please login again.');
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Bids</h2>

      {loading && <p className="text-gray-600">Loading your bids...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {bids.length === 0 && !loading && !error && (
        <p className="text-gray-600">You have not placed any bids yet.</p>
      )}

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
                <strong>Project ID:</strong> {bid.project?.id}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Client Email:</strong> {bid.clientEmail}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Your Bid:</strong> ₹{bid.bidAmount}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Status:</strong>{' '}
                <span
                  className={`font-semibold ${
                    bid.status === 'APPROVED'
                      ? 'text-green-600'
                      : bid.status === 'REJECTED'
                      ? 'text-red-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {bid.status}
                </span>
              </p>
             
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBids;
