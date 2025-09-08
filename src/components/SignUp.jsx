import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SignUp.css";
import NavBar from "./NavBar";
import { signup } from "../service/Api"; // API call function

const SignUp = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(""); // "Client" or "Freelancer"
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    education: "",
    skills: "",
    companyName: "",
    businessType: "",
    resume: null, // To store the uploaded resume file
  });

  const handleUserTypeSelection = (type) => {
    setUserType(type);
    // Reset form fields (including additional fields)
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      education: "",
      skills: "",
      companyName: "",
      businessType: "",
      resume: null,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "resume") {
      setFormData({ ...formData, resume: e.target.files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    // Create FormData and add all necessary fields
    const formDataToSubmit = new FormData();
    for (let key in formData) {
      formDataToSubmit.append(key, formData[key]);
    }
  
    // Add userType and active_status
    formDataToSubmit.append('userType', userType);
    formDataToSubmit.append('active_status', 'active'); // Or whatever the default value is
  
    try {
      const response = await signup(formDataToSubmit);
      alert(response.message);
      // Navigate based on userType (Client or Freelancer)
      if (userType === "Client") {
        navigate("/"); // Redirect to client dashboard
      } else if (userType === "Freelancer") {
        navigate("/"); // Redirect to freelancer dashboard
      }
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };
  
  return (
    <div className="signup-container">
      <div className="signup-wrapper">
        <h3 className="signup-header">Sign Up as</h3>
        <div className="user-type-selection">
          <button
            className={`user-type-btn ${userType === "Client" ? "active" : ""}`}
            onClick={() => handleUserTypeSelection("Client")}
          >
            Client
          </button>

          <button
            className={`user-type-btn ${userType === "Freelancer" ? "active" : ""}`}
            onClick={() => handleUserTypeSelection("Freelancer")}
          >
            Freelancer
          </button>
        </div>

        {userType && (
          <div className="signup-card">
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="signup-form-label">Full Name</label>
                <input
                  type="text"
                  className="signup-form-control"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="signup-form-label">Email</label>
                <input
                  type="email"
                  className="signup-form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="signup-form-label">Phone</label>
                <input
                  type="tel"
                  className="signup-form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="signup-form-label">Password</label>
                <input
                  type="password"
                  className="signup-form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="signup-form-label">Confirm Password</label>
                <input
                  type="password"
                  className="signup-form-control"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Freelancer-Specific Fields */}
              {userType === "Freelancer" && (
                <>
                  <div className="mb-2">
                    <label className="signup-form-label">Education</label>
                    <select
                      className="signup-form-control"
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Education</option>
                      <option value="Degree">Degree</option>
                      <option value="PG">PG</option>
                    </select>
                  </div>

                  <div className="mb-2">
                    <label className="signup-form-label">Skills</label>
                    <input
                      type="text"
                      className="signup-form-control"
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="e.g., React, Java, Python"
                      required
                    />
                  </div>

                  <div className="mb-2">
                    <label className="signup-form-label">Resume (PDF, DOCX)</label>
                    <input
                      type="file"
                      className="signup-form-control"
                      name="resume"
                      accept=".pdf, .docx"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </>
              )}

              {/* Client-Specific Fields */}
              {userType === "Client" && (
                <>
                  <div className="mb-2">
                    <label className="signup-form-label">Company Name</label>
                    <input
                      type="text"
                      className="signup-form-control"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-2">
                    <label className="signup-form-label">Business Type</label>
                    <input
                      type="text"
                      className="signup-form-control"
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      placeholder="e.g., IT, Marketing"
                      required
                    />
                  </div>
                </>
              )}

              <button type="submit" className="signup-btn signup-btn-primary">
                Sign Up
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
