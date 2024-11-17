import React from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import db from "../firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user already exists in Firestore
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        // If user doesn't exist, create a new Firestore document
        await setDoc(userRef, {
          email: user.email,
          role: "user", // Default role
        });
      }

      // Fetch role from Firestore
      const role = userDoc.exists() ? userDoc.data().role : "user";

      if (role === "admin") {
        console.log("You are an admin!");
        navigate("/admin");
      } else {
        console.log("You are a regular user.");
        navigate("/");
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={handleGoogleSignIn} style={styles.button}>
        who are you
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontFamily: "'Inika', 'Arial', sans-serif",
  },
  button: {
    fontFamily: "'Inika', 'Arial', sans-serif",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "black",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
  },
};

export default Login;
