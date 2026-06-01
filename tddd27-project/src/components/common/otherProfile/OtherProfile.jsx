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

// Lets a collaborator propose adding a new course (by course code) to the profile owner's selected courses.
// Sends a change request + notification to the owner. Resets after 3 seconds so another can be proposed.
function ProposeAddCourse({ educationId, ownerId, requestedBy, mandatoryCourses = [], selectedCourses = [] }) {
    const [courseId, setCourseId] = useState("");
    const [sent, setSent] = useState(false);

    async function handlePropose() {

        if (!courseId.trim()) return;
        const code = courseId.trim().toUpperCase(); 

        const validFormat = /^[A-Z]{2,6}\d{2,5}$/.test(code);
        if (!validFormat) {
            alert(`"${code}" doesn't look like a valid course code. Example: TNM084 or tddd27`);
            return;
        }
        // make it not possible to propose adding a course that is already mandatory in the profile,
        if (mandatoryCourses.includes(code)) {
            alert("This course is already a mandatory course in the profile, cannot be added as a selected course.");
            return;
        }

        // Prevent proposing a course that's already in selected courses
        if (selectedCourses.includes(code)) {
            alert(`${code} is already in their selected courses!`);
            return;
        }
        await requestCourseChange(ownerId, {
            requestedBy: requestedBy.uid,
            requestedByName: requestedBy.displayName,
            educationId,
            action: "add",
            courseId: code,
            courseName: code,
        });
        await sendNotification(
            ownerId,
            `${requestedBy.displayName} wants to add "${code}" to your selected courses`,
        );
        setSent(true);
        setCourseId("");
        setTimeout(() => setSent(false), 3000);
    }

    if (sent)
        return (
            <p className="adding_proposal_sent">
                Adding proposal has been sent!
            </p>
        );

    return (
        <div>
            <h5>Propose a course to add:</h5>
            <input
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="input_to_propose_course"
                placeholder="input a Course Code"
            />
            <button className="adding_proposal" onClick={handlePropose}>
                + Propose add
            </button>
        </div>
    );
}

// Lets a collaborator propose removing an existing course from the profile owner's selected courses.
// Sends a change request + notification to the owner.
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
                <p className="Removal_proposed_sent">
                    Removal proposed has been sent!
                </p>
            </div>
        );

    return (
        <div>
            <p>{course.name || course.id}</p>
            <button className="Removal_proposed" onClick={handlePropose}>
                − Propose removal
            </button>
        </div>
    );
}

function OtherProfile() {
    const [displayNameOptions, setDisplayNameOptions] = useState([]);
    const [displayName, setDisplayName] = useState("");
    const [selectedDisplayName, setSelectedDisplayName] = useState(null);
    const [profile, setProfile] = useState(null);

    const navigate = useNavigate();
    const { userId } = useParams();

    const [profileMessage, setProfileMessage] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const [hasAccess, setHasAccess] = useState(false);

    // Track the currently logged-in user.
    useEffect(() => {
        return onAuthStateChanged(auth, (u) => setCurrentUser(u));
    }, []);

    // Check if the current user is in the profile's sharedWith list.
    // Controls whether propose add/remove buttons are shown.
    useEffect(() => {
        if (!profile || !currentUser) {
            setHasAccess(false);
            return;
        }
        const sharedWith = profile.sharedWith || [];
        setHasAccess(sharedWith.includes(currentUser.uid));
    }, [profile, currentUser]);

    // Load the display name for the selected user (used for showing their name).
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

    // Listen in real-time to the selected user's Firestore doc.
    // Only loads their profile if it's public or the current user has access.
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

                if (
                    data.isPublic ||
                    (currentUser && sharedWith.includes(currentUser.uid))
                ) {
                    const educations = await getPublicEducations(selectedDisplayName.id);
                    setProfile({ ...data, educations });
                } else {
                    setProfile(null);
                }
            },
        );

        return () => unsubscribe();
    }, [selectedDisplayName, currentUser]);

    // Load all users for the search autocomplete dropdown.
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

    // Load profile directly from URL if a userId param is present (e.g. /profile/:userId).
    // Same access logic as the search — public or sharedWith only.
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

    // Sends a course change request (add or remove) to the profile owner.
    // Used by both ProposeAddCourse and ProposeRemoveCourse.
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

                {/* Search autocomplete — on selection, checks access and navigates to /profile/:id
                    or shows a private profile message if the user doesn't have access. */}
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

                            if (
                                data?.isPublic ||
                                (currentUser && sharedWith.includes(currentUser.uid))
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

            {/* Profile content — only shown if the profile is accessible */}
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
                                <div className="multiple_programs">

                                    {/* Mandatory courses — read only, no propose buttons */}
                                    <div>
                                        <h5>Mandatory courses</h5>
                                        {education.mandatoryCourses?.map((course) => (
                                            <p
                                                className="courses_in_profile_search"
                                                key={course.id}
                                            >
                                                {course.name || course.id}
                                            </p>
                                        ))}
                                    </div>

                                    {/* Selected courses — collaborators see propose remove buttons */}
                                    <div>
                                        <h5>Selected courses</h5>
                                        {education.selectedCourses?.map((course) => (
                                            <div
                                                className="courses_in_profile_search"
                                                key={course.id}
                                            >
                                                {hasAccess ? (
                                                    <ProposeRemoveCourse
                                                        course={course}
                                                        educationId={education.id}
                                                        onPropose={proposeCourseChange}
                                                    />
                                                ) : (
                                                    <p>{course.name || course.id}</p>
                                                )}
                                            </div>
                                        ))}

                                        {/* Only collaborators can propose adding a new course */}
                                        {hasAccess && (
                                            <ProposeAddCourse
                                                educationId={education.id}
                                                ownerId={userId || selectedDisplayName?.id}
                                                requestedBy={currentUser}
                                                mandatoryCourses={education.mandatoryCourses?.map(c => c.id) || []}
                                                selectedCourses={education.selectedCourses?.map(c => c.id || c.course_code) || []}


                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Shown when a private profile is selected */}
            {profileMessage && (
                <p className="profile_message">{profileMessage}</p>
            )}
        </div>
    );
}

export default OtherProfile;