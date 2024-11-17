import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import db from "../firebase";

const DocumentViewer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location.state || {}; // Get the document ID from navigation state
  const [documentData, setDocumentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchDocument = async () => {
      try {
        const docRef = doc(db, "stickies", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDocumentData(docSnap.data().document); // Assume the `document` field contains the data
        } else {
          console.error("No such document!");
        }
      } catch (err) {
        console.error("Error fetching document:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!documentData) {
    return <h1>No document found!</h1>;
  }

  return (
    <div style={styles.container}>
      <button onClick={() => navigate("/")} style={styles.backButton}>
        ← back
      </button>
      <h1>{documentData.title}</h1>
      <h2>{documentData.subtitle}</h2>

      <pre style={styles.details}>{documentData.content}</pre>

    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Inika, sans-serif",
    backgroundColor: "#fff",
    minHeight: "100vh",
    color: "#333",
  },
  backButton: {
    fontFamily: "Inika",
    background: "none",
    border: "none",
    color: "black",
    cursor: "pointer",
    marginBottom: "20px",
    fontSize: "16px",
  },
  details: {
    backgroundColor: "#f8f8f8",
    padding: "15px",
    borderRadius: "5px",
    whiteSpace: "pre-wrap",
  },
};

export default DocumentViewer;
