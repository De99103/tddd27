import "./DeleteAccountButton.css";
import React, { useEffect, useState } from "react";
import { auth } from "../../../fireBase/firebase";
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";

import deleteICon from "/src/assets/images/delete_icon_user.png";

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

function DeleteAccountButton() {
    return (
        <div>
            <div className="delete-button-wrapper">
                <div className="delete-button">
                    <button
                        onClick={handleDeleteAccount}
                        className="delete-btn"
                    >
                        <img
                            src={deleteICon}
                            alt="Delete account"
                            className="delete-icon"
                        />
                        <p>Delete account</p>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteAccountButton;
