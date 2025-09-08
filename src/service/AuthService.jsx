import { jwtDecode } from "jwt-decode";

export const getUserFromToken = () => {
  const token = localStorage.getItem("authToken");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    console.log("Decoded Token:", decoded); // ✅ Log token details
    return decoded;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
