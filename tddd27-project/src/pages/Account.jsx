import { Login, OtherProfile } from "../components/common";
import { useState, useEffect } from "react";
import { auth, db } from "../fireBase/firebase";
import {
    collection,
    getDocs,
    getDoc,
    doc,
    onSnapshot,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {
    updateProfileVisibility,
    addCollaborator,
    sendNotification,
    saveCourse,
    respondToChangeRequest,
    deleteCourse,
} from "../fireBase/userData";
import Settings from "../components/common/settings/Settings";

import BellIcon from "/src/assets/images/bell icon.png";
import MailboxIcon from "/src/assets/images/mailbox icon.png";

import "./account.css";

// outside Account function
const CourseRow = ({ course }) => {
    const [grade, setGrade] = useState(course.grade || "");
    const [isEditing, setIsEditing] = useState(false);

    async function handleSaveGrade() {
        const validGrades = ["3", "4", "5", "U", "G"];
        if (grade && !validGrades.includes(grade.toUpperCase())) {
            alert("Invalid grade! Only 3, 4, 5, U or G are allowed.");
            return;
        }

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
    async function handleDeleteCourse() {
        if (!confirm(`Remove ${course.course_code} from selected courses?`))
            return;
        try {
            await deleteCourse(course.educationId, course.course_code);
        } catch (error) {
            console.error("Error deleting course:", error);
        }
    }
    console.log("course:", course.course_code, "mandatory:", course.mandatory);
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
                            onChange={(e) => setGrade(e.target.value.toUpperCase())}
                        />
                        <button className="grade-btn" onClick={handleSaveGrade}>
                            Save
                        </button>
                    </>
                ) : (
                    <>
                        <span className="course-grade-value">
                            {grade || <span className="grade-placeholder">Add a grade</span>}
                        </span>
                        <button
                            className="grade-btn"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit
                        </button>
                        {!course.mandatory && (
                            <div className="delete-btn-wrapper">
                                <button className="grade-btn delete-btn" onClick={handleDeleteCourse}>
                                    ✕
                                </button>
                                <span className="delete-tooltip">Remove course</span>
                            </div>
                        )}
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
                        setNotifications(
                            snapshot.docs.map((d) => ({
                                id: d.id,
                                ...d.data(),
                            })),
                        );
                    },
                );
                onSnapshot(
                    collection(db, "users", loggedInUser.uid, "changeRequests"),
                    (snapshot) => {
                        setChangeRequests(
                            snapshot.docs.map((d) => ({
                                id: d.id,
                                ...d.data(),
                            })),
                        );
                    },
                );
                // real-time educations
                onSnapshot(
                    collection(db, "users", loggedInUser.uid, "educations"),
                    (educationSnapshot) => {
                        educationSnapshot.docs.forEach((eduDoc) => {
                            const eduId = eduDoc.id;

                            // real-time mandatory courses
                            onSnapshot(
                                collection(
                                    db,
                                    "users",
                                    loggedInUser.uid,
                                    "educations",
                                    eduId,
                                    "mandatoryCourses",
                                ),
                                (mandatorySnapshot) => {
                                    onSnapshot(
                                        collection(
                                            db,
                                            "users",
                                            loggedInUser.uid,
                                            "educations",
                                            eduId,
                                            "selectedCourses",
                                        ),
                                        (selectedSnapshot) => {
                                            const mapCourse = (
                                                d,
                                                isMandatory,
                                            ) => ({
                                                course_code: d.id,
                                                educationId: eduId,
                                                course_name:
                                                    d.data().courseName || "",
                                                year: d.data().year || "",
                                                semester:
                                                    d.data().semester || "",
                                                credits_hp:
                                                    d.data().credits_hp || "",
                                                period: d.data().period || "",
                                                grade: d.data().grade || "",
                                                mandatory: isMandatory,
                                                elective: !isMandatory,
                                            });

                                            setEducations((prev) => {
                                                const updated = [...prev];
                                                const index = updated.findIndex(
                                                    (e) => e.id === eduId,
                                                );
                                                const newEdu = {
                                                    id: eduId,
                                                    ...eduDoc.data(),
                                                    mandatoryCourses:
                                                        mandatorySnapshot.docs.map(
                                                            (d) =>
                                                                mapCourse(
                                                                    d,
                                                                    true,
                                                                ),
                                                        ),
                                                    selectedCourses:
                                                        selectedSnapshot.docs.map(
                                                            (d) =>
                                                                mapCourse(
                                                                    d,
                                                                    false,
                                                                ),
                                                        ),
                                                };
                                                if (index >= 0) {
                                                    updated[index] = newEdu;
                                                } else {
                                                    updated.push(newEdu);
                                                }
                                                return updated;
                                            });

                                            setLoading(false);
                                        },
                                    );
                                },
                            );
                        });
                    },
                );
            } else {
                setLoading(false);
            }
        });

        return unsubscribe;
    }, []);

    if (loading) return <p>Loading...</p>;
    if (!user)
        return (
            <div>
                <Login />
                <p style={{ textAlign: "center", marginTop: "2rem" }}>
                    Please log in to view your account.
                </p>
            </div>
        );

    async function handleAddCollaborator() {
        try {
            if (!shareEmail) {
                alert("Enter an email first!");
                return;
            }

            const usersSnapshot = await getDocs(collection(db, "users"));
            const match = usersSnapshot.docs.find(
                (d) =>
                    d.data().email?.toLowerCase() ===
                    shareEmail.trim().toLowerCase() ||
                    d.data().displayName?.toLowerCase() ===
                    shareEmail.trim().toLowerCase(),
            );

            if (!match) {
                alert("No user found with that email!");
                return;
            }

            const collaboratorUid = match.id;
            await addCollaborator(user.uid, collaboratorUid);
            await sendNotification(
                collaboratorUid,
                `${user.displayName} has given you access to their profile!`,
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

            <div className="notifi_search-section">
                <div className="notifi_search-top">
                    {changeRequests.length > 0 && (
                        <div className="account-section">
                            <h2>
                                <img
                                    src={MailboxIcon}
                                    alt="mailbox icon"
                                    className="mailbox-icon"
                                />{" "}
                                Pending Course Changes
                            </h2>
                            <div className="notifications-scroll">
                                {changeRequests
                                    .sort(
                                        (a, b) =>
                                            (b.createdAt?.seconds || 0) -
                                            (a.createdAt?.seconds || 0),
                                    )

                                    .map((req) => (

                                        <div
                                            key={req.id}
                                            className="notification-row"
                                        >
                                            <p>
                                                <b>{req.requestedByName}</b>{" "}
                                                wants to{" "}
                                                {req.action === "add" ? (
                                                    <>
                                                        add{" "}
                                                        <b>{req.courseName}</b>
                                                    </>
                                                ) : (
                                                    <>
                                                        remove{" "}
                                                        <b>{req.courseName}</b>
                                                    </>
                                                )}{" "}
                                                from your selected courses in{" "}
                                                <b>{req.educationId}</b>
                                            </p>
                                            <span className="notification-time">
                                                {req.createdAt?.seconds
                                                    ? new Date(
                                                        req.createdAt
                                                            .seconds * 1000,
                                                    ).toLocaleString()
                                                    : ""}
                                            </span>
                                            <br />

                                            <button
                                                onClick={() => {
                                                    console.log(
                                                        "requestData:",
                                                        req,
                                                    );

                                                    respondToChangeRequest(
                                                        user.uid,
                                                        req.id,
                                                        true,
                                                        req,
                                                    );
                                                }}
                                            >
                                                <p className="accept">Accept</p>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    respondToChangeRequest(
                                                        user.uid,
                                                        req.id,
                                                        false,
                                                        req,
                                                    )
                                                }
                                            >
                                                <p className="reject">Reject</p>
                                            </button>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                    {/* Notifications */}
                    {notifications.length > 0 && (
                        <div className="account-section">
                            <h2>
                                {" "}
                                <img
                                    src={BellIcon}
                                    alt="Bell icon"
                                    className="bell-icon"
                                />{" "}
                                Notifications
                            </h2>
                            <div className="notifications-scroll">
                                {[
                                    ...new Map(
                                        notifications.map((n) => [
                                            n.message + n.createdAt?.seconds,
                                            n,
                                        ]),
                                    ).values(),
                                ]
                                    .sort(
                                        (a, b) =>
                                            (b.createdAt?.seconds || 0) -
                                            (a.createdAt?.seconds || 0),
                                    )
                                    .map((notif) => (
                                        <div
                                            key={notif.id}
                                            className="notification-row"
                                        >
                                            <p>{notif.message}</p>
                                            <span className="notification-time">
                                                {notif.createdAt?.seconds
                                                    ? new Date(
                                                        notif.createdAt
                                                            .seconds * 1000,
                                                    ).toLocaleString()
                                                    : ""}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="notifi_search-down">
                    <div className="search-share-half">
                        <p className="search-share-label">Search for a profile:</p>
                        <OtherProfile />
                    </div>
                    <div className="search-share-divider" />

                    {/* Share with someone */}
                    {/* User types email → look up their uid in Firestore
            → add uid to sharedWith array → they can now edit */}
                    <div className="share-half">

                        <div className="share-row">
                            <input
                                className="search-share-input"
                                type="text"
                                placeholder="Enter their email or username..."
                                value={shareEmail}
                                onChange={(e) => setShareEmail(e.target.value)}
                            />
                            <button className="share-btn" onClick={handleAddCollaborator}>
                                Give Access
                            </button>
                        </div>
                    </div>
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
                                onClick={() =>
                                    setOpenEducationId(
                                        openEducationId === edu.id
                                            ? null
                                            : edu.id,
                                    )
                                }
                            >
                                {edu.id}
                                <span>
                                    {openEducationId === edu.id ? "▲" : "▼"}
                                </span>
                            </h3>

                            {openEducationId === edu.id && (
                                <div className="courses-section">
                                    {/* Mandatory Courses */}
                                    {edu.mandatoryCourses.length > 0 && (
                                        <div>
                                            <h4>Mandatory Courses</h4>
                                            {edu.mandatoryCourses
                                                .sort((a, b) => Number(a.year) - Number(b.year) || Number(a.semester) - Number(b.semester))
                                                .map(
                                                    (course) => (
                                                        <CourseRow
                                                            key={course.course_code}
                                                            course={course}
                                                        />
                                                    ),
                                                )}
                                        </div>
                                    )}

                                    {/* Selected Courses */}
                                    {edu.selectedCourses.length > 0 && (
                                        <div>
                                            <h4>Selected Courses</h4>
                                            {edu.selectedCourses
                                                .sort((a, b) => Number(a.year) - Number(b.year) || Number(a.semester) - Number(b.semester))

                                                .map(
                                                    (course) => (
                                                        <CourseRow
                                                            key={course.course_code}
                                                            course={course}
                                                        />
                                                    ),
                                                )}
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
