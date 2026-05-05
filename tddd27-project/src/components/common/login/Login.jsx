import React, { useEffect, useState } from "react";
import { auth } from "../../../fireBase/firebase";
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";

import loginIcon from "/src/assets/images/login.svg";
import logoutIcon from "/src/assets/images/logut.svg";
import deleteICon from "/src/assets/images/delete_icon_user.png";
import "./Login.css";

import { deleteAccount } from "../../../fireBase/userData";

async function handleDeleteAccount() {
    try {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete your account?",
        );

        if (!confirmDelete) return;

        await deleteAccount();

        alert("Account deleted.");
    } catch (error) {
        console.error("Error deleting account:", error);
    }
}

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
                <div className="logging-wrapper">
                    <div className="logging">
                        <div className="user-row">
                            <p className="user-name">
                                Inloggad som: {user.displayName}
                            </p>

                            <button
                                onClick={handleLogout}
                                className="logut-btn"
                            >
                                <img
                                    src={logoutIcon}
                                    alt="Logga ut"
                                    className="login-icon"
                                />
                                <span>Logga ut</span>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="login-div">
                    <button onClick={handleLogin} className="login-btn">
                        <img
                            src={loginIcon}
                            alt="Logga in"
                            className="login-icon"
                        />
                        <span>Logga in med Google</span>
                    </button>
                </div>
            )}
        </div>
    );
}

export default Login;
