import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

function UserList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all users from the backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/auth/all");
      const nonAdminUsers = response.data.filter(user => user.role !== "ADMIN");
      console.log(nonAdminUsers); // Check the response data
      setUsers(nonAdminUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/auth/delete/${id}`);
      fetchUsers(); // Refresh users list
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="user-list-container">
      <h2>User Management</h2>
      <Button className="mb-3" onClick={() => navigate("/admin")}>
        Back to Admin
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>User Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            // Only non-admin users will appear because of the filter above
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.fullName}</td>

              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.role}</td>
              <td>{user.userType}</td>
              <td>
                <Button variant="danger" onClick={() => handleDelete(user.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      
    </div>
  );
}

export default UserList;
