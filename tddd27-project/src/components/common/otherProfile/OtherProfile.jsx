import "./OtherProfile.css";
import { useState, useEffect } from "react";
import Autocomplete from "../autocomplete/Autocomplete";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../../fireBase/firebase";
import {
    getName,
    getDisplayNameOptions,
    getPublicEducations,
    requestCourseChange,
    sendNotification,
} from "../../../fireBase/userData";
import { auth } from "../../../fireBase/firebase";
import { onAuthStateChanged } from "firebase/auth";


function ProposeAddCourse({ educationId, ownerId, requestedBy }) {
    const [courseId, setCourseId] = useState("");
    const [sent, setSent] = useState(false);

    async function handlePropose() {
        if (!courseId.trim()) return;
        await requestCourseChange(ownerId, {
            requestedBy: requestedBy.uid,
            requestedByName: requestedBy.displayName,
            educationId,
            action: "add",
            courseId: courseId.trim().toUpperCase(),
            courseName: courseId.trim().toUpperCase(),
        });
        await sendNotification(
            ownerId,
            `${requestedBy.displayName} wants to add "${courseId.toUpperCase()}" to your selected courses`,
        );
        setSent(true);
        setCourseId(""); // clear input

        // reset after 3 seconds so they can propose another
        setTimeout(() => setSent(false), 3000);
    }

    if (sent) return <p className="adding_proposal_sent">Adding proposal has been sent!</p>;

    return (
        <div>
            <input
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                placeholder="Course ID to add"
            />
            <button className="adding_proposal" onClick={handlePropose}>
                + Propose add
            </button>
        </div>
    );
}

function ProposeRemoveCourse({ course, educationId, onPropose }) {
    const [sent, setSent] = useState(false);

    async function handlePropose() {
        await onPropose(educationId, "remove", course);
        setSent(true);
    }

    if (sent)
        return (
            <div>
                <p>{course.name || course.id}</p>
                <p className = "Removal_proposed_sent">Removal proposed has been sent! </p>
            </div>
        );

    return (
        <div>
            <p>{course.name || course.id}</p>
            <button  className = "Removal_proposed" onClick={handlePropose}>− Propose removal</button>
        </div>
    );
}

function OtherProfile() {
    const [displayNameOptions, setDisplayNameOptions] = useState([]);
    const [displayName, setDisplayName] = useState("");
    const [selectedDisplayName, setSelectedDisplayName] = useState(null);

    const [profile, setProfile] = useState(null); // State to hold the profile data

    const navigate = useNavigate();
    const { userId } = useParams();

    const [profileMessage, setProfileMessage] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const [hasAccess, setHasAccess] = useState(false);
    useEffect(() => {
        return onAuthStateChanged(auth, (u) => setCurrentUser(u));
    }, []);

    // check if visitor is in sharedWith
    useEffect(() => {
        if (!profile || !currentUser) {
            setHasAccess(false);
            return;
        }
        const sharedWith = profile.sharedWith || [];
        setHasAccess(sharedWith.includes(currentUser.uid));
    }, [profile, currentUser]);

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
        if (!selectedDisplayName?.id) {
            setProfile(null);
            return;
        }

        const unsubscribe = onSnapshot(
            doc(db, "users", selectedDisplayName.id),
            async (userDoc) => {
                if (!userDoc.exists()) {
                    setProfile(null);
                    return;
                }

                const data = userDoc.data();
                const sharedWith = data?.sharedWith || [];

                // show profile if public OR if current user is a collaborator
                if (
                    data.isPublic ||
                    (currentUser && sharedWith.includes(currentUser.uid))
                ) {
                    const educations = await getPublicEducations(
                        selectedDisplayName.id,
                    );
                    setProfile({ ...data, educations });
                } else {
                    setProfile(null);
                }
            },
        );

        return () => unsubscribe(); // cleanup on unmount
    }, [selectedDisplayName, currentUser]);

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

    //load profile from URL
    useEffect(() => {
        if (!userId) return;

        const unsubscribe = onSnapshot(
            doc(db, "users", userId),
            async (userDoc) => {
                if (!userDoc.exists()) {
                    setProfile(null);
                    return;
                }

                const data = userDoc.data();
                const sharedWith = data?.sharedWith || [];

                if (
                    data.isPublic ||
                    (currentUser && sharedWith.includes(currentUser.uid))
                ) {
                    const educations = await getPublicEducations(userId);
                    setProfile({ ...data, educations });
                } else {
                    setProfile(null);
                }
            },
        );

        return () => unsubscribe();
    }, [userId, currentUser]);

    // check if visitor is in sharedWith
    useEffect(() => {
        if (!profile || !currentUser) {
            setHasAccess(false);
            return;
        }
        const sharedWith = profile.sharedWith || [];
        setHasAccess(sharedWith.includes(currentUser.uid));
    }, [profile, currentUser]);

    async function proposeCourseChange(educationId, action, course) {
        const ownerId = userId || selectedDisplayName?.id;
        await requestCourseChange(ownerId, {
            requestedBy: currentUser.uid,
            requestedByName: currentUser.displayName,
            educationId,
            action,
            courseId: course.id,
            courseName: course.name || course.id,
        });
        await sendNotification(
            ownerId,
            `${currentUser.displayName} wants to ${action} "${course.name || course.id}" from your selected courses`,
        );
    }

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
                            const userDoc = await getDoc(
                                doc(db, "users", displayName.id),
                            );
                            const data = userDoc.data();
                            const sharedWith = data?.sharedWith || [];

                            console.log("currentUser:", currentUser);
                            console.log("sharedWith:", sharedWith);
                            console.log("isPublic:", data?.isPublic);

                            // allow if public OR if current user is in sharedWith
                            if (
                                data?.isPublic ||
                                (currentUser &&
                                    sharedWith.includes(currentUser.uid))
                            ) {
                                navigate(`/profile/${displayName.id}`);
                            } else {
                                setProfileMessage(
                                    "This profile is private, connect with the user to see their profile.",
                                );
                            }
                        } catch (error) {
                            console.error("Error checking profile:", error);
                            setProfileMessage("Could not open this profile.");
                        }
                    }}
                />

                <p>'s profile</p>
            </div>
            {profile && (
                <div className="other_profile_overlay">
                    <div className="visited_profile">
                        <p>You are looking at</p>
                        <strong>{profile.displayName}</strong>
                    </div>

                    <div className="educations_container">
                        {profile.educations?.map((education) => (
                            <div className="education_card" key={education.id}>
                                <h4>{education.name || education.id}</h4>

                                <div>
                                    <h5>Mandatory courses</h5>
                                    {education.mandatoryCourses?.map(
                                        (course) => (
                                            <p className="courses_in_profile_search" key={course.id}>
                                                {course.name || course.id}
                                            </p>
                                        ),
                                    )}
                                </div>

                                <div>
                                    <h5>Selected courses</h5>
                                    {education.selectedCourses?.map(
                                        (course) => (
                                            <div className="courses_in_profile_search"key={course.id}>
                                                {hasAccess ? (
                                                    <ProposeRemoveCourse
                                                        course={course}
                                                        educationId={
                                                            education.id
                                                        }
                                                        onPropose={
                                                            proposeCourseChange
                                                        }
                                                    />
                                                ) : (
                                                    <p>
                                                        {course.name ||
                                                            course.id}
                                                    </p>
                                                )}
                                            </div>
                                        ),
                                    )}

                                    {/* Propose adding a new course */}
                                    {hasAccess && (
                                        <ProposeAddCourse
                                            educationId={education.id}
                                            ownerId={
                                                userId ||
                                                selectedDisplayName?.id
                                            }
                                            requestedBy={currentUser}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {profileMessage && (
                <p className="profile_message">{profileMessage}</p>
            )}

        </div>
    );
}

export default OtherProfile;
