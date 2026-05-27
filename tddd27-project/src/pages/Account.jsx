import { Login, OtherProfile } from "../components/common";
import { useState, useEffect } from "react";
import { auth, db } from "../fireBase/firebase";
import { collection, getDocs, getDoc, doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { updateProfileVisibility, addCollaborator, sendNotification, saveCourse, respondToChangeRequest } from "../fireBase/userData";
import Settings from "../components/common/settings/Settings";

import "./account.css";

// outside Account function
const CourseRow = ({ course }) => {
    const [grade, setGrade] = useState(course.grade || "");
    const [isEditing, setIsEditing] = useState(false);

    async function handleSaveGrade() {
        try {
            await saveCourse(
                course.educationId,
                course.mandatory ? "mandatory" : "selectedCourses",
                course.course_code,
                {
                    grade: grade,
                    year: course.year ?? "",
                    semester: course.semester ?? "",
                    courseName: course.course_name,
                    credits_hp: course.credits_hp ?? "",
                },
            );
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving grade:", error);
        }
    }

    return (
        <div className="course-row">
            <span className="course-code">{course.course_code}</span>
            <span className="course-name">{course.course_name}</span>
            <span className="course-hp">
                {course.credits_hp ? `${course.credits_hp}hp` : ""}
            </span>
            <span className="course-year">
                {course.year ? `Year ${course.year}` : ""}
            </span>
            <div className="course-grade">
                {isEditing ? (
                    <>
                        <input
                            className="grade-input"
                            type="text"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            autoFocus
                        />
                        <button className="grade-btn" onClick={handleSaveGrade}>
                            Save
                        </button>
                    </>
                ) : (
                    <>
                        <span>{grade || "—"}</span>
                        <button
                            className="grade-btn"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

function Account() {
    const [user, setUser] = useState(null);
    const [educations, setEducations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPublic, setIsPublic] = useState(false);
    const [shareEmail, setShareEmail] = useState("");
    const [notifications, setNotifications] = useState([]);
    const [openEducationId, setOpenEducationId] = useState(null);
    const [changeRequests, setChangeRequests] = useState([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (loggedInUser) => {
            if (loggedInUser) {
                setUser(loggedInUser);

                // fetch isPublic
                const userDoc = await getDoc(
                    doc(db, "users", loggedInUser.uid),
                );
                if (userDoc.exists()) {
                    setIsPublic(userDoc.data().isPublic || false);
                }

                // real-time notifications
                onSnapshot(
                    collection(db, "users", loggedInUser.uid, "notifications"),
                    (snapshot) => {
                        setNotifications(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
                    }
                );
                onSnapshot(
                    collection(db, "users", loggedInUser.uid, "changeRequests"),
                    (snapshot) => {
                        setChangeRequests(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
                    }
                );
                // real-time educations
                onSnapshot(
                    collection(db, "users", loggedInUser.uid, "educations"),
                    async (educationSnapshot) => {
                        const educationsList = await Promise.all(
                            educationSnapshot.docs.map(async (eduDoc) => {
                                const eduId = eduDoc.id;

                                // real-time mandatory courses
                                // one-time fetch for courses (education onSnapshot handles re-renders)
                                const mandatorySnapshot = await getDocs(
                                    collection(db, "users", loggedInUser.uid, "educations", eduId, "mandatoryCourses")
                                );

                                const selectedSnapshot = await getDocs(
                                    collection(db, "users", loggedInUser.uid, "educations", eduId, "selectedCourses")
                                );

                                const mapCourse = (d, isMandatory) => ({
                                    course_code: d.id,
                                    educationId: eduId,
                                    course_name: d.data().courseName || "",
                                    year: d.data().year || "",
                                    semester: d.data().semester || "",
                                    credits_hp: d.data().credits_hp || "",
                                    period: d.data().period || "",
                                    grade: d.data().grade || "",
                                    mandatory: isMandatory,
                                    elective: !isMandatory,
                                });

                                return {
                                    id: eduId,
                                    ...eduDoc.data(),
                                    mandatoryCourses: mandatorySnapshot.docs.map(d => mapCourse(d, true)),
                                    selectedCourses: selectedSnapshot.docs.map(d => mapCourse(d, false)),
                                };
                            })
                        );

                        setEducations(educationsList);
                        setLoading(false);
                    }
                );

            } else {
                setLoading(false);
            }
        });

        return unsubscribe;
    }, []);


    if (loading) return <p>Loading...</p>;
    if (!user) return (
        <div>
            <Login />
            <p style={{ textAlign: "center", marginTop: "2rem" }}>
                Please log in to view your account.
            </p>
        </div>
    );
    async function handleToggleVisibility() {
        try {
            const newValue = !isPublic;
            await updateProfileVisibility(newValue);
            setIsPublic(newValue);
        } catch (error) {
            console.error("Error updating visibility:", error);
        }
    }

    async function handleAddCollaborator() {
        try {
            if (!shareEmail) { alert("Enter an email first!"); return; } // toDO:  make it find people with username too.. 

            const usersSnapshot = await getDocs(collection(db, "users"));
            const match = usersSnapshot.docs.find(
                (d) =>
                    d.data().email?.toLowerCase() === shareEmail.trim().toLowerCase() ||
                    d.data().displayName?.toLowerCase() === shareEmail.trim().toLowerCase()
            );

            if (!match) { alert("No user found with that email!"); return; }

            const collaboratorUid = match.id;
            await addCollaborator(user.uid, collaboratorUid);
            await sendNotification(collaboratorUid,
                `${user.displayName} has given you access to their profile!`
            );
            alert(`Access given to ${shareEmail}!`);
            setShareEmail("");
        } catch (error) {
            console.error("Error adding collaborator:", error);
        }
    }

    return (
        <div>
            <div className="settings_and_loginout">
                <Settings />
                <Login />
            </div>

            <OtherProfile />

            {/* Profile Visibility
            <div className="account-section">
                <h2>Profile Visibility</h2>
                <label className="visibility-toggle">
                    <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={handleToggleVisibility}
                    />
                    {isPublic
                        ? "Public — anyone can see your profile"
                        : "Private — only you can see your profile"}
                </label>
            </div> */}

            {/* Notifications */}
            {notifications.length > 0 && (
                <div className="account-section">
                    <h2>🔔 Notifications</h2>
                    <div className="notifications-scroll">
                        {[...new Map(notifications.map(n => [n.message + n.createdAt?.seconds, n])).values()]
                            .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
                            .map((notif) => (
                                <div key={notif.id} className="notification-row">
                                    <p>{notif.message}</p>
                                    <span className="notification-time">
                                        {notif.createdAt?.seconds
                                            ? new Date(notif.createdAt.seconds * 1000).toLocaleString()
                                            : ""}
                                    </span>
                                </div>
                            ))
                        }
                    </div>
                </div>
            )}

            {changeRequests.length > 0 && (
                <div className="account-section">
                    <h2>📬 Pending Course Changes</h2>
                    {changeRequests.map((req) => (
                        <div key={req.id} className="notification-row">
                            <p>
                                <b>{req.requestedByName}</b> wants to{" "}
                                {req.action === "add" ? <>add <b>{req.courseName}</b></> : <>remove <b>{req.courseName}</b></>}
                                {" "}from your selected courses in <b>{req.educationId}</b>
                            </p>
                            <button onClick={() => {
                                console.log("requestData:", req);

                                respondToChangeRequest(user.uid, req.id, true, req)
                            }}>
                                ✅ Accept
                            </button>
                            <button onClick={() => respondToChangeRequest(user.uid, req.id, false, req)}>
                                ❌ Reject
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Share with someone */}
            {/* User types email → look up their uid in Firestore
            → add uid to sharedWith array → they can now edit */}
            <div className="account-section">
                <h2>Share with someone</h2>
                <div className="share-row">
                    <input
                        className="share-input"
                        type="text"
                        placeholder="Enter their email or username!"
                        value={shareEmail}
                        onChange={(e) => setShareEmail(e.target.value)}
                    />
                    <button className="share-btn" onClick={handleAddCollaborator}>Give Access</button>
                </div>
            </div>

            {/* Educations */}
            <div className="educations-section">
                <h2>Your Educations</h2>
                {educations.length === 0 ? (
                    <p>No educations saved yet.</p>
                ) : (
                    educations.map((edu) => (
                        <div key={edu.id} className="education-block">
                            {/* clickable header */}
                            <h3
                                className="education-header"
                                onClick={() => setOpenEducationId(
                                    openEducationId === edu.id ? null : edu.id
                                )}
                            >
                                {edu.id}
                                <span>{openEducationId === edu.id ? "▲" : "▼"}</span>
                            </h3>

                            {openEducationId === edu.id && (
                                <div className="courses-section">
                                    {/* Mandatory Courses */}
                                    {edu.mandatoryCourses.length > 0 && (
                                        <div>
                                            <h4>Mandatory Courses</h4>
                                            {edu.mandatoryCourses.map((course) => (
                                                <CourseRow key={course.course_code} course={course} />
                                            ))}
                                        </div>
                                    )}

                                    {/* Selected Courses */}
                                    {edu.selectedCourses.length > 0 && (
                                        <div>
                                            <h4>Selected Courses</h4>
                                            {edu.selectedCourses.map((course) => (
                                                <CourseRow key={course.course_code} course={course} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Account;
