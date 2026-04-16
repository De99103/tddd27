import React, { useEffect, useState } from "react";
import { auth } from "../../../firebase"; 
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

function Login() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log(result.user);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div>
      {user ? (
        <>
          <p>Inloggad som: {user.displayName}</p>
          <p>{user.email}</p>
          <button onClick={handleLogout}>Logga ut</button>
        </>
      ) : (
        <button onClick={handleLogin}>Logga in med Google</button>
      )}
    </div>
  );
}

export default Login;