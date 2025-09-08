import React, { useEffect, useState } from "react";
import axios from "axios";

const Earnings = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const freelancerId = localStorage.getItem("freelancerId");

      const response = await axios.get(
        `http://localhost:8081/api/payments/freelancer`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPayments(response.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  return (
    <div className="payment-list-container">
      <h2>🧾 My Payment History</h2>
      {payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Amount (₹)</th>
              <th>Method</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr key={index}>
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

export default Earnings;
