import React from "react";
import { useDrop } from "react-dnd";
import DraggableSticky from "../components/draggablesticky";
const StickyDropZone = ({ stickies, handleUpdateStickyPosition, handleRightClickSticky }) => {
  const [, dropRef] = useDrop({
    accept: "STICKY",
    drop: (item, monitor) => {
      const offset = monitor.getDifferenceFromInitialOffset();

      if (offset) {
        const newX = item.x + offset.x;
        const newY = item.y + offset.y;
        handleUpdateStickyPosition(item.id, newX, newY);
      }
    },
  });

  return (
    <div ref={dropRef} style={styles.container}>
      {stickies.map((sticky) => (
        <DraggableSticky
          key={sticky.id}
          sticky={sticky}
          onRightClick={(e) => handleRightClickSticky(e, sticky)} // Pass right-click events
        />
      ))}
    </div>
  );
};

const styles = {
  container: {
    position: "relative",
    width: "100vw",
    height: "100vh",
    backgroundColor: "#f8f8f8",
  },
};

export default StickyDropZone;
