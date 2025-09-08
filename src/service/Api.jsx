import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api/auth"; // Update if using a hosted backend
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  if (!token) {
      console.error("⚠️ No token found! Redirecting to login...");
      alert("Session expired. Please log in again.");
      window.location.href = "/login"; // Redirect user to login
      throw new Error("Unauthorized - No Token");
  }

  return {
      headers: { Authorization: `Bearer ${token}` },
  };
};
export const signup = async (userData) => {
    try {
        console.log("Sending signup request:", userData);
        const response = await axios.post(`${API_BASE_URL}/signup`, userData, {
            headers: { "Content-Type": "application/json" }
        });
        return response.data;
    } catch (error) {
        console.error("Error during signup:", error.response ? error.response.data : error);
        throw new Error(error.response?.data?.message || "Signup failed");
    }
};

export const login = async (loginData) => {
  try {
    console.log("📡 Sending Login Request:", loginData);

    const response = await axios.post(`${API_BASE_URL}/login`, loginData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true, // ✅ Ensure cookies/tokens are sent
    });

    console.log("✅ Server Response:", response.data);

    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
    }

    return response.data;
  } catch (error) {
    console.error("❌ Login Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Login failed. Please try again." };
  }
};
