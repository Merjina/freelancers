import React, { useState, useEffect } from "react";
import { addProject, getProjects, deleteProject, updateProject } from "../service/Api1";
import "../styles/PostProject.css";
import { FaEdit, FaTrash, FaTimes, FaCheck } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

const PostProject = ({ setShowPostProject }) => {
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
  });

  const [projects, setProjects] = useState([]);
  const [editProject, setEditProject] = useState(null);
  const [clientName, setClientName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setClientName(decoded.sub || "Client");
    }
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    }
  };

  const handleAddProject = async () => {
    if (!newProject.title || !newProject.description || !newProject.budget || !newProject.deadline) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      await addProject(newProject);
      setNewProject({ title: "", description: "", budget: "", deadline: "" });
      fetchProjects();
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id);
        fetchProjects();
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  const handleEdit = (project) => {
    setEditProject({ ...project });
  };

  const handleUpdate = async () => {
    if (!editProject?.id) return;
    try {
      await updateProject(editProject.id, editProject);
      setEditProject(null);
      fetchProjects();
    } catch (error) {
      console.error("❌ Error updating project:", error);
    }
  };

  return (
    <div className="post-project-container">
      <h2>Post a New Project</h2>
      <div className="form-container">
        <input type="text" placeholder="Project Title" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} />
        <textarea placeholder="Project Description" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} />
        <input type="number" placeholder="Budget ($)" value={newProject.budget} onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })} />
        <input type="date" value={newProject.deadline} onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })} />
        <p>Client: <strong>{clientName}</strong></p>
        <button onClick={handleAddProject}>Post Project</button>
        <button className="cancel-btn" onClick={() => setShowPostProject(false)}>Cancel</button>
      </div>

      <div className="table-container">
        <h3>Your Projects</h3>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Budget ($)</th>
              <th>Deadline</th>
              <th>Client</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length > 0 ? (
              projects.map((project) => (
                <tr key={project.id}>
                  <td>{project.title}</td>
                  <td>{project.description}</td>
                  <td>{project.budget}</td>
                  <td>{project.deadline}</td>
                  <td>{project.clientName}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(project)}><FaEdit /></button>
                    <button className="delete-btn" onClick={() => handleDelete(project.id)}><FaTrash /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6">No projects found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editProject && (
        <div className="edit-card">
          <h3>Edit Project</h3>
          <input type="text" value={editProject.title} onChange={(e) => setEditProject({ ...editProject, title: e.target.value })} />
          <textarea value={editProject.description} onChange={(e) => setEditProject({ ...editProject, description: e.target.value })} />
          <input type="number" value={editProject.budget} onChange={(e) => setEditProject({ ...editProject, budget: e.target.value })} />
          <input type="date" value={editProject.deadline} onChange={(e) => setEditProject({ ...editProject, deadline: e.target.value })} />
          <button className="update-btn" onClick={handleUpdate}><FaCheck /> Update</button>
          <button className="cancel-btn" onClick={() => setEditProject(null)}><FaTimes /> Cancel</button>
        </div>
      )}
    </div>
  );
};

export default PostProject;
