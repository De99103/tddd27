import "./Settings.css";
import settingsIcon from "/src/assets/images/settings_icon.png";
import { useState, useEffect } from "react";
import { auth, db } from "../../../fireBase/firebase.js";
import { updateProfileVisibility } from "../../../fireBase/userData.js";
import DeleteAccountButton from "../deleteAccountButton/DeleteAccountButton";

function Settings() {
    const [settingsOpen, setSettingsOpen] = useState(false);

    const [popupSettings, setPopupSettings] = useState(false);

    const [user, setUser] = useState(null);
    const [isPublic, setIsPublic] = useState(false);

    const toggleSettings = () => {
        setSettingsOpen(!settingsOpen);
    };

    async function handleToggleVisibility() {
        try {
            const newValue = !isPublic;
            await updateProfileVisibility(newValue);
            setIsPublic(newValue);
        } catch (error) {
            console.error("Error updating visibility:", error);
        }
    }

    return (
        <div className="settings_page">
            <div className="settings_container">
                <button
                    className={`settings_button ${settingsOpen ? "open" : ""}`}
                    onClick={() => setPopupSettings(true)}
                >
                    <img
                        src={settingsIcon}
                        alt="Settings button"
                        className="settings_icon"
                    />
                    <span>Settings</span>
                </button>
            </div>

            {popupSettings && (
                <div
                    className="popup_settings_overlay"
                    onClick={() => setPopupSettings(false)}
                >
                    <div
                        className="popup_settings_content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="settings_popup">
                            <div className="account-section">
                                <h2 className="title_in_settings">
                                    Profile Visibility
                                </h2>
                                <label className="visibility-toggle">
                                    <input
                                        type="checkbox"
                                        checked={isPublic}
                                        onChange={handleToggleVisibility}
                                        className="visibility_checkbox"
                                    />
                                    {isPublic
                                        ? "Public — anyone can see your profile"
                                        : "Private — only you can see your profile"}
                                </label>
                            </div>

                            <DeleteAccountButton />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Settings;
