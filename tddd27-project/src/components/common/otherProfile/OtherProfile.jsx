import "./OtherProfile.css";
import { useState, useEffect } from "react";
import Autocomplete from "../autocomplete/Autocomplete";

import { getName, getDisplayNameOptions } from "../../../fireBase/userData";

function OtherProfile() {
    const [displayNameOptions, setDisplayNameOptions] = useState([]);
    const [displayName, setDisplayname] = useState("");
    const [selectedDisplayName, setSelectedDisplayName] = useState(null);
    const [profileSelected, setProfileSelected] = useState(false);

    useEffect(() => {
        async function loadName() {
            try {
                if (!selectedDisplayName?.id) return;

                const name = await getName(selectedDisplayName.id);
                setDisplayname(name || "");

                setProfileSelected(profileSelected);
            } catch (error) {
                console.error("Error loading name:", error);
            }
        }

        loadName();
    }, [selectedDisplayName]);

    useEffect(() => {
        async function loadUsers() {
            try {
                const users = await getDisplayNameOptions();
                setDisplayNameOptions(users);
            } catch (error) {
                console.error("Error loading users:", error);
            }
        }

        loadUsers();
    }, []);

    return (
        <div className="other_profile_page">
            <div className="search_profile_container">
                <p>Search for </p>

                <Autocomplete
                    options={displayNameOptions}
                    label=""
                    className="line-autocomplete profile_search"
                    value={selectedDisplayName}
                    getOptionLabel={(option) => option?.name || ""}
                    onChange={(displayName) => {
                        setSelectedDisplayName(displayName);
                        setProfileSelected(displayName);
                    }}
                />

                <p>'s profile</p>
            </div>

            <div className="other_profile_overlay">
                <p>You are looking at </p>
                <h3>{displayName}</h3>
                <p id="s_after_name_search">'s profile</p>
            </div>

            <style>{`
            
                .other_profile_overlay {
                    display: ${profileSelected ? "flex" : "none"};
                }
                

            `}</style>
        </div>
    );
}

export default OtherProfile;
