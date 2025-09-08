import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Payment.css";

const Payment = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [selectedFreelancer, setSelectedFreelancer] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  // Conditional input values
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [bankName, setBankName] = useState("");

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const fetchFreelancers = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/auth/all");
      const freelancerList = response.data.filter(
        (user) => user.userType?.toLowerCase() === "freelancer"
      );
      setFreelancers(freelancerList);
    } catch (error) {
      console.error("Error fetching freelancers:", error);
    }
  };

  const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  if (!selectedFreelancer || !amount || !paymentMethod) {
    alert("Please fill all required fields.");
    return;
  }

  const payload = {
    freelancerId: selectedFreelancer,
    amount: parseFloat(amount),
    paymentMethod: paymentMethod,
    upiId: paymentMethod === "UPI" ? upiId : null,
    cardNumber: paymentMethod === "Credit Card" ? cardNumber : null,
    cardHolderName: paymentMethod === "Credit Card" ? cardHolder : null,
    bankName: paymentMethod === "Net Banking" ? bankName : null,
  };

  try {
    setLoading(true); // Show loading spinner
    const token = localStorage.getItem("token");
    
    await axios.post("http://localhost:8081/api/payments/create", payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    alert("✅ Payment submitted successfully!");
    // Reset form
    setSelectedFreelancer("");
    setAmount("");
    setPaymentMethod("");
    setUpiId("");
    setCardNumber("");
    setCardHolder("");
    setBankName("");
  } catch (error) {
    console.error("Error submitting payment:", error);
    alert("❌ Payment failed.");
  } finally {
    setLoading(false); // Hide loading spinner
  }
};
  return (
    <div className="payment-wrapper">
      <div className="payment-container">
        <h2>💼 Pay Your Freelancer</h2>

        <div className="form-group">
          <label>Choose Freelancer</label>
          <select
            value={selectedFreelancer}
            onChange={(e) => setSelectedFreelancer(e.target.value)}
          >
            <option value="">-- Select a Freelancer --</option>
            {freelancers.map((freelancer) => (
              <option key={freelancer.id} value={freelancer.id}>
                {freelancer.fullName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Enter Amount (₹)</label>
          <input
            type="number"
            min="0"
            placeholder="e.g. 5000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Payment Method</label>
          <div className="payment-options">
            <label>
              <input
                type="radio"
                name="method"
                value="Credit Card"
                checked={paymentMethod === "Credit Card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              💳 Credit Card
            </label>
            <label>
              <input
                type="radio"
                name="method"
                value="UPI"
                checked={paymentMethod === "UPI"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              📱 UPI
            </label>
            <label>
              <input
                type="radio"
                name="method"
                value="Net Banking"
                checked={paymentMethod === "Net Banking"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              🏦 Net Banking
            </label>
          </div>
        </div>

        {/* Conditional Inputs */}
        {paymentMethod === "UPI" && (
          <div className="form-group">
            <label>Enter UPI ID</label>
            <input
              type="text"
              placeholder="e.g. user@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
          </div>
        )}

        {paymentMethod === "Credit Card" && (
          <>
            <div className="form-group">
              <label>Card Number</label>
              <input
                type="text"
                placeholder="e.g. 1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Cardholder Name</label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
              />
            </div>
          </>
        )}

        {paymentMethod === "Net Banking" && (
          <div className="form-group">
            <label>Bank Name</label>
            <input
              type="text"
              placeholder="e.g. HDFC, SBI"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />
          </div>
        )}

        <button onClick={handleSubmit}>💰 Proceed to Pay</button>
      </div>
    </div>
  );
};

export default Payment;
