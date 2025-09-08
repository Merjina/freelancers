import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useLocation, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function ResetPassword() {
  const location = useLocation();
  
  // Extract token from query parameters
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token"); // ✅ Correct way to get token

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    if (!token) {
      setError("Invalid or missing reset token.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const result = await response.json();
      console.log("Server Response:", result);

      if (response.ok) {
        setMessage("Your password has been reset successfully.");
      } else {
        setError(result.message || "Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="reset-password-container">
      <Row className="justify-content-center">
        <Col md={6} className="reset-password-form-wrapper">
          <h2 className="text-center">Reset Password</h2>

          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formNewPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button 
              variant="success" 
              type="submit" 
              className="w-100 mt-4"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>

            <p className="text-center mt-3">
              <Link to="/">Back to Login</Link>
            </p>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default ResetPassword;
