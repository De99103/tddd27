import React, { useEffect, useState } from "react";
import { auth } from "../../../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import loginIcon from "/src/assets/images/login.svg";
import logoutIcon from "/src/assets/images/logut.svg";

import "./Login.css";

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
        <div style={{ display: "flex", width: "100%" }}>
          <div className="logging">
            <p className="user-name">Inloggad som: {user.displayName}</p>
            <button onClick={handleLogout} className="logut-btn">
              <img src={logoutIcon} alt="Logga ut" className="login-icon" />
              <span>Logga ut</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="login-div" >
          <button onClick={handleLogin} className="login-btn">
            <img src={loginIcon} alt="Logga in" className="login-icon" />
            <span>Logga in med Google</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default Login;