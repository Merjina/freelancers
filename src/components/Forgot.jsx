import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Forgot.css";

function Forgot() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8081/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const result = await response.json();
      console.log("Server Response:", result);

      if (response.ok) {
        setMessage("A password reset link has been sent to your email.");
      } else {
        setError(result.message || "Failed to send reset link. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="forgot-password-container">
      <Row className="justify-content-center">
        <Col md={6} className="forgot-password-form-wrapper">
          <h2 className="text-center">Forgot Password</h2>
          <p className="text-center">Enter your email to reset your password</p>

          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 mt-4"
              disabled={!isValidEmail(email) || loading}
            >
              {loading ? "Sending..." : "Reset Password"}
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

export default Forgot;
