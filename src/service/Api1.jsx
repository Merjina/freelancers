import axios from "axios";
// Optional: Import jwt-decode if you want to check token expiry
// import jwtDecode from "jwt-decode";

const API_URL = "http://localhost:8081/api/projects";
const PAYMENTS_URL = "http://localhost:8081/api/payments";

// Optional: Check if token is expired
// const isTokenExpired = (token) => {
//     try {
//         const decoded = jwtDecode(token);
//         return decoded.exp * 1000 < Date.now();
//     } catch (error) {
//         console.error("Error decoding token:", error);
//         return true; // Treat as expired if invalid
//     }
// };

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    if (!token /* || isTokenExpired(token) */) {
        console.error("⚠️ No token found or token expired.");
        throw new Error("Unauthorized - Token missing or expired");
    }

    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const getProjects = async () => {
    try {
        const response = await axios.get(API_URL, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching projects:", error.response?.data || error.message);
        throw error;
    }
};

export const addProject = async (project) => {
    try {
        const response = await axios.post(API_URL, project, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("❌ Error adding project:", error.response?.data || error.message);
        throw error;
    }
};

export const updateProject = async (projectId, projectData) => {
    try {
        const response = await axios.put(`${API_URL}/${projectId}`, projectData, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("❌ Error updating project:", error.response?.data || error.message);
        throw error;
    }
};

export const deleteProject = async (projectId) => {
    try {
        const response = await axios.delete(`${API_URL}/${projectId}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("❌ Error deleting project:", error.response?.data || error.message);
        throw error;
    }
};

export const getProjectsByClient = async (clientId) => {
    try {
        const response = await axios.get(`${API_URL}/client/${clientId}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching projects by client:", error.response?.data || error.message);
        return [];
    }
};

// PAYMENT API CALLS

export const makePayment = async (paymentData) => {
    try {
        const response = await axios.post(`${PAYMENTS_URL}/make`, paymentData, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("❌ Error making payment:", error.response?.data || error.message);
        throw error;
    }
};

export const fetchPaymentHistory = async () => {
    try {
        const response = await axios.get(`${PAYMENTS_URL}/history`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching payment history:", error.response?.data || error.message);
        return [];
    }
};
