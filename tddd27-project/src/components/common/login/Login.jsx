import React, { useEffect, useState } from "react";
import { auth } from "../../../fireBase/firebase";
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";

import loginIcon from "/src/assets/images/login.png";
import logoutIcon from "/src/assets/images/logout.png";

import "./Login.css";
import DeleteAccountButton from "../deleteAccountButton/DeleteAccountButton";

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
                                Signed in as: {user.displayName}
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
                                <span>Sign out</span>
                            </button>
                        </div>
                        <DeleteAccountButton />
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
                        <span>Sign in with Google</span>
                    </button>
                </div>
            )}
        </div>
    );
}

export default Login;
