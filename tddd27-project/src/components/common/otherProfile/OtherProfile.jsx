import "./OtherProfile.css";
import { useState, useEffect } from "react";
import Autocomplete from "../autocomplete/Autocomplete";
import { useNavigate, useParams } from "react-router-dom";


import { getName, getDisplayNameOptions, getPublicProfile, getPublicEducations } from "../../../fireBase/userData";

function OtherProfile() {
    const [displayNameOptions, setDisplayNameOptions] = useState([]);
    const [displayName, setDisplayName] = useState("");
    const [selectedDisplayName, setSelectedDisplayName] = useState(null);

    const profileSelected = Boolean(selectedDisplayName);

    const [profile, setProfile] = useState(null); // State to hold the profile data
    const [educations, setEducations] = useState([]);

    const navigate = useNavigate();
    const { userId } = useParams();

    const [profileMessage, setProfileMessage] = useState("");

    useEffect(() => {
        async function loadName() {
            try {
                if (!selectedDisplayName?.id) return;

                const name = await getName(selectedDisplayName.id);
                setDisplayName(name || "");

            } catch (error) {
                console.error("Error loading name:", error);
            }
        }

        loadName();
    }, [selectedDisplayName]);

    useEffect(() => {
        async function loadProfile() {
            if (!selectedDisplayName?.id) {
                setProfile(null);
                return;
            }

            try {
                console.log("selected user id:", selectedDisplayName.id);

                const publicProfile = await getPublicProfile(selectedDisplayName.id);

                console.log("public profile:", publicProfile);

                setProfile(publicProfile);
            } catch (error) {
                console.error("Error loading public profile:", error);
                setProfile(null);
            }
        }

        loadProfile();
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

    useEffect(() => {
        async function loadProfileFromUrl() {
            if (!userId) return;

            const publicProfile = await getPublicProfile(userId);
            setProfile(publicProfile);
        }

        loadProfileFromUrl();
    }, [userId]);

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
                    onChange={async (displayName) => {
                        setSelectedDisplayName(displayName);
                        setProfile(null);
                        setProfileMessage("");

                        if (!displayName?.id) return;

                        try {
                            const publicProfile = await getPublicProfile(displayName.id);

                            if (!publicProfile) {
                                setProfileMessage("This profile is private");
                                return;
                            }

                            navigate(`/profile/${displayName.id}`);
                        } catch (error) {
                            console.error("Error checking profile:", error);

                            if (error.code === "permission-denied") {
                                setProfileMessage("This profile is private,  connect with the user to see their profile.");
                            } else {
                                setProfileMessage("Could not open this profile.");
                            }
                        }
                    }}
                />

                <p>'s profile</p>
            </div>
            {profile && (
                <div className="other_profile_overlay">
                    <p>You are looking at</p>
                    <h3>{profile.displayName}</h3>
                    <p>{profile.bio}</p>

                    <div className="educations_container">
                        {profile.educations?.map((education) => (
                            <div className="education_card" key={education.id}>
                                <h4>{education.name || education.id}</h4>

                                <div>
                                    <h5>Mandatory courses</h5>
                                    {education.mandatoryCourses?.map((course) => (
                                        <p key={course.id}>{course.name || course.id}</p>
                                    ))}
                                </div>

                                <div>
                                    <h5>Selected courses</h5>
                                    {education.selectedCourses?.map((course) => (
                                        <p key={course.id}>{course.name || course.id}</p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {profileMessage && (
                <p className="profile_message">{profileMessage}</p>
            )}

            {/* <div className="other_profile_overlay">
                <p>You are looking at </p>
                <h3>{displayName}</h3>
                <p id="s_after_name_search">'s profile</p>
            </div>

            <style>{`
            
                .other_profile_overlay {
                    display: ${profileSelected ? "flex" : "none"};
                }
                

            `}</style> */}
        </div >
    );
}

export default OtherProfile;
