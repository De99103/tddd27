import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Header } from "./components/common";

import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import Account from "./pages/Account";

import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

function App() {
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
      await signInWithPopup(auth, provider);
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
    <BrowserRouter>
      <div className="App">
        <Header />

        {user ? (
          <div>
            <p>Inloggad som: {user.displayName}</p>
            <p>{user.email}</p>
            <button onClick={handleLogout}>Logga ut</button>
          </div>
        ) : (
          <button onClick={handleLogin}>Logga in med Google</button>
        )}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/account" element={<Account />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;