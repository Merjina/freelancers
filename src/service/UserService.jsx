import axios from "axios";

// ✅ Corrected endpoint for freelancers
export const getFreelancers = async () => {
  const response = await axios.get("http://localhost:8081/api/auth/freelancers");
  return response.data;
};

// ✅ Corrected endpoint for clients
export const getClients = async () => {
  const response = await axios.get("http://localhost:8081/api/auth/clients");
  return response.data;
};
