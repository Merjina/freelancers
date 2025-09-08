import React, { useEffect, useState } from "react";
import axios from "axios";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);
  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("authToken");
      console.log("Token being sent: ", token);  // Log token to check if it's correct and being sent
  
      const response = await axios.get('http://localhost:8081/api/payments/all', {
        headers: {
          Authorization: `Bearer ${token}`,  // Ensure "Bearer" is followed by the token
        }
      });
      console.log('Payments:', response.data);
      setPayments(response.data); // Store payments in state
    } catch (error) {
      console.error('Error fetching payments:', error);
      if (error.response && error.response.status === 401) {
        console.log('Token is invalid or expired');
      }
    }
  };
  
  return (
    <div className="payment-list-container">
      <h2>📋 All Submitted Payments</h2>
      {payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Freelancer</th>
              <th>Amount (₹)</th>
              <th>Method</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.freelancerFullName || "N/A"}</td>

                <td>{payment.amount}</td>
                <td>{payment.paymentMethod}</td>
                <td>
                  {payment.paymentMethod === "UPI" && `UPI ID: ${payment.upiId}`}
                  {payment.paymentMethod === "Credit Card" &&
                    `Card: ${payment.cardNumber}, Name: ${payment.cardHolderName}`}
                  {payment.paymentMethod === "Net Banking" && `Bank: ${payment.bankName}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PaymentHistory;
