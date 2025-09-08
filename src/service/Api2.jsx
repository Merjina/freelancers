import axios from "axios";

const API_URL = "http://localhost:8081/api/bids";

// Function to place a bid
export const placeBid = async (bid) => {
  try {
    const response = await axios.post(`${API_URL}/placeBid`, bid);
    return response.data; // Handle the response data accordingly
  } catch (error) {
    console.error("Error placing bid:", error);
    throw error; // Propagate the error for further handling
  }
};


// Function to get bids for a freelancer
export const getBids = async (freelancerName) => {
  try {
    const response = await axios.get(`${API_URL}/${freelancerName}`);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching bids:", error);
    return [];
  }
};
export const fetchBidsForProject = async (projectId) => {
  try {
    const response = await axios.get(`${BIDS_API_URL}/project/${projectId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching bids:", error);
    return [];
  }
};
