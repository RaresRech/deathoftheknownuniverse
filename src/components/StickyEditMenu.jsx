import React, { useState } from "react";

const StickyEditMenu = ({ sticky, onClose, onUpdate, onDelete }) => {
  const [updatedSticky, setUpdatedSticky] = useState(sticky);

  const handleChange = (field, value) => {
    setUpdatedSticky((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDocumentChange = (field, value) => {
    setUpdatedSticky((prev) => ({
      ...prev,
      document: {
        ...prev.document,
        [field]: value,
      },
    }));
  };

  
  const handleSave = () => {
    onUpdate(updatedSticky);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.menu}>
        <h3>Edit Sticky</h3>
        <input
          type="text"
          value={updatedSticky.document.title}
          onChange={(e) => handleDocumentChange("title", e.target.value)}
          placeholder="Title"
        />
        <textarea
          value={updatedSticky.document.subtitle}
          onChange={(e) => handleDocumentChange("subtitle", e.target.value)}
          placeholder="Subtitle"
        />
        <textarea
          style={{height:200, width: 500}}
          value={updatedSticky.document.content}
          onChange={(e) => handleDocumentChange("content", e.target.value)}
          placeholder="Content"
        />

        <label>Color:</label>
        <select
          value={updatedSticky.color}
          onChange={(e) => handleChange("color", e.target.value)}
        >
          <option value="yellow">Yellow</option>
          <option value="black">Black</option>
        </select>
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
        <button onClick={onDelete} style={styles.deleteButton}>
          Delete
        </button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  menu: {
    background: "#fff",
    padding: "20px",
    borderRadius: "5px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    zIndex: 20,
  },
  deleteButton: {
    backgroundColor: "red",
    color: "#fff",
    border: "none",
    padding: "10px",
    cursor: "pointer",
  },
};

export default StickyEditMenu;
