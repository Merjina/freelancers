import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Feedback.css";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({ name: "", feedback: "", rating: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ✅ Navigation hook

  useEffect(() => {
    fetchFeedback();
    setLoggedInUser();
  }, []);

  const fetchFeedback = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setErrorMessage("No token found, please login.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8081/api/auth/feedback", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch feedback.");
      }

      const feedbackData = await response.json();
      setFeedbackList(feedbackData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      setErrorMessage("Failed to fetch feedback.");
      setLoading(false);
    }
  };

  const setLoggedInUser = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const username = decodedToken?.sub || "";
      setFormData((prev) => ({ ...prev, name: username }));
    }
  };

  const handleBack = () => {
    navigate(-1); // ✅ Go to previous page
  };

  return (
    <div className="feedback-container">
      <div className="feedback-list">
        {loading ? (
          <p>Loading feedback...</p>
        ) : feedbackList.length > 0 ? (
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

      {/* ✅ Back Button */}
      <div className="back-btn-container">
        <button onClick={handleBack} className="back-btn">Back</button>
      </div>
    </div>
  );
};

export default FeedbackForm;
