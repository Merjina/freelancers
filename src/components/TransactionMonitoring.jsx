import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate
import '../styles/TransactionMonitoring.css';

const TransactionMonitoring = () => {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate(); // ✅ Initialize navigate

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8081/api/payments/transactions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  const downloadPDF = () => {
    const input = document.getElementById('transaction-table');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('transaction-history.pdf');
    });
  };

  const handleBack = () => {
    navigate(-1); // ✅ Navigate to previous page
  };

  return (
    <div className="transaction-container">
      <h2 className="transaction-title">Transaction Monitoring</h2>
      
      <div className="table-wrapper">
        <table id="transaction-table" className="transaction-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>User</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <tr key={tx.transactionId}>
                  <td>{tx.transactionId}</td>
                  <td>{tx.userName}</td>
                  <td>₹{tx.amount}</td>
                  <td>{tx.status}</td>
                  <td>{new Date(tx.date).toLocaleString()}</td>
                  <td>{tx.paymentMethod}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">No transactions found</td>
              </tr>
            )}
          </tbody>
        </table>
        
      </div>
      <button onClick={downloadPDF} className="download-btn">Download PDF</button>

      {/* ✅ Back Button */}
      <div className="back-btn-container">
        <button onClick={handleBack} className="back-btn">Back</button>
      </div>
    </div>
  );
};

export default TransactionMonitoring;
