// 📁 src/components/ManageProjects.jsx
import React, { useEffect, useState } from "react";
import { getProjectsByClient, updateProject, deleteProject } from "../service/Api1";
import EditProjectForm from "./EditProjectForm";
import TagFreelancersForm from "./TagFreelancersForm";
import { useNavigate } from "react-router-dom";
import "../styles/ManageProjects.css";

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [taggingProjectId, setTaggingProjectId] = useState(null);
  const navigate = useNavigate();

  const fetchClientProjects = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("📨 User object:", user); // ✅ Add this
    if (!user || !user.email) return;
    console.log("📬 Fetching projects for:", user.email); // ✅ Add this
    const data = await getProjectsByClient(user.email);
    console.log("📦 Fetched projects:", data); // ✅ Add this
    setProjects(data);
  };

  useEffect(() => {
    fetchClientProjects();
  }, []);

  const handleStatusChange = async (projectId, newStatus) => {
    await updateProject(projectId, { status: newStatus });
    fetchClientProjects();
  };

  const handleEdit = (project) => setEditingProject(project);
  const handleDelete = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await deleteProject(projectId);
      fetchClientProjects();
    }
  };
  const handleSaveEdit = async (updatedData) => {
    await updateProject(editingProject.id, updatedData);
    setEditingProject(null);
    fetchClientProjects();
  };

  return (
    <div className="manage-projects-container">
      <h2>Manage Your Projects</h2>
      {editingProject ? (
        <EditProjectForm
          project={editingProject}
          onSave={handleSaveEdit}
          onCancel={() => setEditingProject(null)}
        />
      ) : (
        <table className="project-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Budget</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>{project.title}</td>
                <td>
                <select
                  value={project.status ?? ""}
                  onChange={(e) => handleStatusChange(project.id, e.target.value)}
                >
                  <option value="">Select Status</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>

                </td>
                <td>{project.budget}</td>
                <td>
                  <button onClick={() => handleEdit(project)}>Edit</button>
                  <button onClick={() => handleDelete(project.id)}>Delete</button>
                  <button onClick={() => setTaggingProjectId(project.id)}>Tag</button>
                  <button onClick={() => navigate(`../viewbids?projectId=${project.id}`)}>View Bids</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}


        <button className="back-button" onClick={() => navigate(-1)}>
            ← Back
        </button>


      {taggingProjectId && (
        <TagFreelancersForm
          projectId={taggingProjectId}
          onClose={() => setTaggingProjectId(null)}
        />
      )}
    </div>
  );
};

export default ManageProjects;
