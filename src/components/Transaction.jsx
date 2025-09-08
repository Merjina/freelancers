import React, { useEffect, useState } from "react";
import axios from "axios";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [client, setClient] = useState(null);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const clientId = localStorage.getItem("clientId"); // Assuming client ID is stored in localStorage

      // Fetch payments and client details from the backend
      const response = await axios.get(`http://localhost:8081/api/payments/history/${clientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        setPayments(response.data.payments);
        setClient(response.data.client);  // Assuming the response has client details
      }
    } catch (error) {
      console.error("Error fetching payment history:", error);
    }
  };

  return (
    <div className="payment-history-container">
      <h2>Payment History for {client?.fullName || "Client"}</h2>

      {/* If no payments are available */}
      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Amount (₹)</th>
            <th>Date</th>
            <th>Status</th>
            <th>Payment Method</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {payments.length === 0 ? (
            <tr>
              <td colSpan="6">No payments found.</td>
            </tr>
          ) : (
            payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{payment.amount}</td>
                <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                <td>{payment.status}</td>
                <td>{payment.paymentMethod}</td>
                <td>
                  {payment.paymentMethod === "UPI" && `UPI ID: ${payment.upiId}`}
                  {payment.paymentMethod === "Credit Card" &&
                    `Card: ${payment.cardNumber}, Name: ${payment.cardHolderName}`}
                  {payment.paymentMethod === "Net Banking" && `Bank: ${payment.bankName}`}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;
