import React, { useRef } from "react";
import { useDrag } from "react-dnd";

const DraggableSticky = ({ sticky, isEditing, onRightClick }) => {
  const elementRef = useRef();

  const [{ isDragging }, dragRef] = useDrag({
    type: "STICKY",
    item: () => ({
      id: sticky.id,
      x: sticky.x || 0,
      y: sticky.y || 0,
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  dragRef(elementRef);

  return (
    <div
      ref={elementRef}
      style={{
        position: "absolute",
        left: `${sticky.x}px`,
        top: `${sticky.y}px`,
        opacity: isDragging || isEditing ? 0.5 : 1, // Dim while dragging or editing
        cursor: "move",
        width: "120px",
        height: "150px",
        zIndex: isEditing ? 0 : 1, // Lower z-index while editing
      }}
      onContextMenu={onRightClick} // Handle right-click
    >
      <img
        src={`./assets/sticky_${sticky.color}.png`}
        alt={`${sticky.color} Sticky Note`}
        style={{
          width: "100%",
          height: "120px",
          objectFit: "cover",
          borderRadius: "5px",
        }}
      />
      <p
        style={{
          marginTop: "5px",
          fontSize: "14px",
          fontWeight: "bold",
          color: "#333",
          alignSelf: "center",

        }}
      >
        {sticky.document.title || "Untitled"}
      </p>
    </div>
  );
};

export default DraggableSticky;
