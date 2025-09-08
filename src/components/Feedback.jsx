import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Feedback.css";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({ name: "", feedback: "", rating: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [feedbackList, setFeedbackList] = useState([]); // Store feedback
  const navigate = useNavigate(); // Initialize navigation

  // Fetch feedback when the component mounts
  useEffect(() => {
    fetchFeedback();
    setLoggedInUser();  // Set the logged-in user's name
  }, []);

  // Fetch feedback from backend
  const fetchFeedback = async () => {
    const token = localStorage.getItem("authToken"); // Retrieve the token from localStorage
    if (!token) {
      setErrorMessage("No token found, please login.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/api/auth/feedback", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`, // Attach token to the Authorization header
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch feedback.");
      }

      const feedbackData = await response.json();
      setFeedbackList(feedbackData); // Set the feedback data on success
    } catch (error) {
      console.error("Error fetching feedback:", error);
      setErrorMessage("Failed to fetch feedback.");
    }
  };

  // Get logged-in user details and set the name
  const setLoggedInUser = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT token to get the user details
      const username = decodedToken?.sub || ""; // Assuming the username is in the 'sub' field of the token
      setFormData((prev) => ({ ...prev, name: username }));
    }
  };

  // Submit feedback to backend
  const submitFeedback = async (formData) => {
    const token = localStorage.getItem("authToken"); // Retrieve the token from localStorage
    if (!token) {
      throw new Error("No token found, please login.");
    }

    try {
      const response = await fetch("http://localhost:8081/api/auth/feedback", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`, // Attach token to the Authorization header
          "Content-Type": "application/json", // Ensure the backend expects JSON data
        },
        body: JSON.stringify(formData), // Send the form data as JSON
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback.");
      }

      return await response.json(); // Return the response data if successful
    } catch (error) {
      console.error("Error submitting feedback:", error);
      throw error;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name && formData.feedback && formData.rating) {
      try {
        await submitFeedback(formData); // Submit feedback to backend
        setSubmitted(true);
        setErrorMessage(""); // Clear any previous errors
        setFormData({ name: "", feedback: "", rating: "" }); // Reset form data
        fetchFeedback(); // Refresh the feedback list after submitting
      } catch (error) {
        setErrorMessage(error.message || "Failed to submit feedback");
      }
    }
  };

  return (
    <div className="feedback-container">
      <div className="feedback-card">
        <h2 className="feedback-title">Feedback Form</h2>
        {submitted && <p className="feedback-success">Thank you for your feedback!</p>}
        {errorMessage && <p className="feedback-error">{errorMessage}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="feedback-group">
            <label htmlFor="name">UserName:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="feedback-input"
              required
            />
          </div>
          <div className="feedback-group">
            <label htmlFor="rating">Rating:</label>
            <select
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="feedback-select"
              required
            >
              <option value="">Select Rating</option>
              <option value="1">1 - Poor</option>
              <option value="2">2 - Fair</option>
              <option value="3">3 - Good</option>
              <option value="4">4 - Very Good</option>
              <option value="5">5 - Excellent</option>
            </select>
          </div>
          <div className="feedback-group">
            <label htmlFor="feedback">Feedback:</label>
            <textarea
              id="feedback"
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              className="feedback-textarea"
              placeholder="Write your feedback here..."
              required
            ></textarea>
          </div>
          <button type="submit" className="feedback-button">
            Submit Feedback
          </button>
          <button
            type="button"
            className="feedback-button feedback-back-button"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </form>
      </div>

      {/* Display fetched feedback */}
      <div className="feedback-list">
        {/* <h3>Recent Feedback</h3> */}
        {feedbackList.length > 0 ? (
          feedbackList.map((feedback) => (
            <div key={feedback.id} className="feedback-card">
              <div className="feedback-card-body">
              <h3>Recent Feedback</h3>
                <p><strong>{feedback.name}</strong></p>
                <p>Rating: {feedback.rating}</p>
                <p>{feedback.feedback}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No feedback available.</p>
        )}
      </div>
    </div>
  );
};

export default FeedbackForm;
