import React from "react";
import { useNavigate } from "react-router-dom";

const colorToImageMap = {
  yellow: "./assets/sticky_yellow.png",
  black: "./assets/sticky_black.png",
};

const Sticky = ({ color, document, title, x, y, id }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/document", { state: { id } }); // Pass the document ID
  };

  return (
    <div
      onClick={handleClick}
      style={{
        ...styles.stickyContainer,
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      <div style={styles.sticky}>
        <img
          src={colorToImageMap[color]}
          alt={`${color} Sticky`}
          style={styles.image}
        />
      </div>
      <p style={styles.title}>{title}</p>
    </div>
  );
};

const styles = {
  stickyContainer: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    cursor: "pointer",
  },
  sticky: {
    width: "120px",
    height: "120px",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  title: {
    marginTop: "10px",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#333",
  },
};

export default Sticky;
