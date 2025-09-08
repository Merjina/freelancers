import React, { useState } from "react";

const TagFreelancersForm = ({ projectId, onClose }) => {
  const [freelancerId, setFreelancerId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Tagging Freelancer ${freelancerId} to Project ${projectId}`);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="tag-freelancers-form">
      <h3>Tag Freelancer</h3>
      <input
        placeholder="Enter Freelancer ID"
        value={freelancerId}
        onChange={(e) => setFreelancerId(e.target.value)}
        required
      />
      <button type="submit">Tag</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
};

export default TagFreelancersForm;
