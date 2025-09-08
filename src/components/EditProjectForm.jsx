import React, { useState } from "react";

const EditProjectForm = ({ project, onSave, onCancel }) => {
  const [title, setTitle] = useState(project.title);
  const [budget, setBudget] = useState(project.budget);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, budget });
  };

  return (
    <form onSubmit={handleSubmit} className="edit-project-form">
      <h3>Edit Project</h3>
      <label>Title</label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} required />

      <label>Budget</label>
      <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} required />

      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default EditProjectForm;
