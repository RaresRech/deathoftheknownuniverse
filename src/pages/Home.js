import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import Sticky from "../components/sticky";
import db from "../firebase";

const Home = () => {
  const [stickies, setStickies] = useState([]);

  useEffect(() => {
    // Real-time Firestore listener
    const unsubscribe = onSnapshot(collection(db, "stickies"), (snapshot) => {
      const fetchedStickies = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStickies(fetchedStickies);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  return (
    <div style={styles.container}>
      {/* Top Links */}
      <div style={styles.topLinks}>
        <span style={styles.link}>death of the known universe →</span>
      </div>

      {/* Stickies with dynamic positions */}
      {stickies.map((sticky) => (
        <Sticky
          key={sticky.id}
          color={sticky.color}
          document={sticky.document}
          title={sticky.document.title}
          x={sticky.x}
          y={sticky.y}
          id={sticky.id}
        />
      ))}

      {/* Bottom Links */}
      <div style={styles.bottomLinks}>
        <span style={styles.social}>instagram</span>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: "relative",
    width: "100vw",
    height: "100vh",
    backgroundColor: "#f8f8f8",
    fontFamily: "'Inika', 'Arial', sans-serif",
  },
  topLinks: {
    position: "absolute",
    top: "20px",
    left: "20px",
    fontSize: "14px",
    color: "#000",
  },
  bottomLinks: {
    position: "absolute",
    bottom: "20px",
    left: "20px",
    fontSize: "12px",
    color: "#666",
  },
  link: {
    cursor: "pointer",
    textTransform: "lowercase",
    fontWeight: "300",
  },
  social: {
    cursor: "pointer",
    textTransform: "lowercase",
  },
};

export default Home;
