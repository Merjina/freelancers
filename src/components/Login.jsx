import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { login } from "../service/Api"; // Corrected import

const Login = () => {
  const navigate = useNavigate();
  // Change "email" to "identifier" here:
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await login(loginData); // Call API function
        console.log("🔹 Login API Response:", response); // ✅ Debugging log

        if (!response || !response.token || !response.role) {
            alert("⚠️ Missing token or role! Check backend response.");
            return;
        }

        // ✅ Save token separately in localStorage
        localStorage.setItem("token", response.token);

        // ✅ Store user details (excluding token for security)
        localStorage.setItem("user", JSON.stringify({
            role: response.role,
            userType: response.userType || "N/A",
            id: response.id || "N/A",
            fullName: response.fullName || "User",
            email: response.email || loginData.email, // ✅ Add this line
        }));

        alert(`✅ Welcome, ${response.fullName}! Role: ${response.role}`);

        // ✅ Navigate based on role
        switch (response.role) {
            case "ADMIN":
                navigate("/admin");
                break;
            case "CLIENT":
                navigate("/client-dashboard");
                break;
            case "FREELANCER":
                navigate("/freelancer-dashboard");
                break;
            default:
                alert("⚠️ Unknown role. Redirecting to home.");
                navigate("/home");
        }
    } catch (error) {
        alert(error.message || "❌ Login failed. Please try again.");
        console.error("Login error:", error);
    }
};



return (
    <div className="login-container">
      <div className="login-card mt-5 mb-5">
        <center><h2>Login</h2></center>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            {/* Updated label and input name */}
            <label htmlFor="identifier">Email or Phone</label>
            <input
              type="text"
              id="email"
              name="email"
              className="login-input-field"
              placeholder="Enter your email or phone"
              value={loginData.identifier}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="login-input-field"
              placeholder="Enter your password"
              value={loginData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group d-flex justify-content-between align-items-center">
            <div>
              <input type="checkbox" id="rememberMe" />
              <label htmlFor="rememberMe"> Remember Me</label>
            </div>
            <div>
              <a href="/forgot" className="forgot-password-link text-decoration-none">
                Forgot Password?
              </a>
            </div>
          </div>
          <center><button type="submit" className="login-btn">Login</button></center>
        </form>
        <p className="signup-text">
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
