import React, { useEffect, useState, useRef } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc, deleteDoc,collection, onSnapshot, updateDoc, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import db from "../firebase";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import StickyEditMenu from "../components/StickyEditMenu";
import DraggableSticky from "../components/draggablesticky";
import StickyDropZone from "../components/StickyDropZone";
import debounce from "lodash.debounce";

const Admin = () => {
  const [stickies, setStickies] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedSticky, setSelectedSticky] = useState(null); // For the edit modal
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser;

      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();

        if (userData && userData.role === "admin") {
          setIsAdmin(true);
        } else {
          navigate("/");
        }
      } catch (err) {
        console.error("Error fetching user role:", err);
        navigate("/");
      }
    };

    checkAdmin();
  }, [auth, navigate]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "stickies"), (snapshot) => {
      const fetchedStickies = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStickies(fetchedStickies);
    });

    return () => unsubscribe();
  }, []);

  const debounceUpdate = useRef(
    debounce(async (id, x, y) => {
      try {
        await updateDoc(doc(db, "stickies", id), { x, y });
      } catch (err) {
        console.error("Error updating sticky position:", err);
      }
    }, 300)
  ).current;

  const handleUpdateStickyPosition = (id, x, y) => {
    setStickies((prevStickies) =>
      prevStickies.map((sticky) =>
        sticky.id === id ? { ...sticky, x, y } : sticky
      )
    );

    debounceUpdate(id, x, y);
  };

  const handleCreateSticky = async () => {
    try {
      const defaultSticky = {
        color: "yellow",
        document: {
          title: "Untitled",
          content: "New sticky content",
          subtitle: "",
          details: "",
        },
        x: 100,
        y: 100,
      };
      const docRef = await addDoc(collection(db, "stickies"), defaultSticky);
      setStickies((prev) => [...prev, { id: docRef.id, ...defaultSticky }]);
    } catch (err) {
      console.error("Error creating new sticky:", err);
    }
  };


  
  const handleRightClickSticky = (event, sticky) => {
    event.preventDefault();
    setSelectedSticky(sticky);
  };

  const handleUpdateStickyData = async (updatedSticky) => {
    try {
      await updateDoc(doc(db, "stickies", updatedSticky.id), updatedSticky);
      setStickies((prevStickies) =>
        prevStickies.map((sticky) =>
          sticky.id === updatedSticky.id ? updatedSticky : sticky
        )
      );
      setSelectedSticky(null);
    } catch (err) {
      console.error("Error updating sticky:", err);
    }
  };

  const handleDeleteSticky = async (stickyId) => {
    try {
      // Use deleteDoc to remove the document from Firestore
      await deleteDoc(doc(db, "stickies", stickyId));
      // Update the local state to remove the deleted sticky
      setStickies((prevStickies) =>
        prevStickies.filter((sticky) => sticky.id !== stickyId)
      );
      setSelectedSticky(null); // Close the edit modal
    } catch (err) {
      console.error("Error deleting sticky:", err);
    }
  };

  if (!isAdmin) {
    return <h1>Loading...</h1>;
  }

  return (

    <DndProvider backend={HTML5Backend}>
        {/* Only show stickies if no sticky is being edited */}
        {!selectedSticky && (
          <StickyDropZone
            stickies={stickies}
            handleUpdateStickyPosition={handleUpdateStickyPosition}
            handleRightClickSticky={handleRightClickSticky} />
        )}

        <button style={styles.addButton} onClick={handleCreateSticky}>
          +
        </button>

        {/* Sticky edit modal */}
        {selectedSticky && (
          <StickyEditMenu
            sticky={selectedSticky}
            onClose={() => setSelectedSticky(null)}
            onUpdate={handleUpdateStickyData}
            onDelete={() => handleDeleteSticky(selectedSticky.id)} />
        )}
      </DndProvider>

  );
};

const styles = {

topLinks: {
position: "absolute",
top: "20px",
left: "20px",
fontSize: "14px",
color: "#000",
},
link: {
cursor: "pointer",
textTransform: "lowercase",
fontWeight: "300",
},
  addButton: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: "#f8d948",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
};

export default Admin;

