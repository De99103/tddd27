import { Course, Login, Stats_Window, OtherProfile } from "../components/common";
import { useState, useEffect } from "react";

import { auth, db } from "../fireBase/firebase"
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { updateProfileVisibility, addCollaborator, sendNotification } from "../fireBase/userData";
import CoursesTable from "../components/common/courses_tabell/CoursesTable";
import "./account.css";

function Account() {
    const [user, setUser] = useState(null);
    const [educations, setEducations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPublic, setIsPublic] = useState(false);
    const [shareEmail, setShareEmail] = useState("");
    const [notifications, setNotifications] = useState([]);
    const [openEducationId, setOpenEducationId] = useState(null);
    const [isEditing, setIsEditing] = useState();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (loggedInUser) => {
            if (loggedInUser) {
                setUser(loggedInUser);

                const notifSnapshot = await getDocs(
                    collection(db, "users", loggedInUser.uid, "notifications")
                );
                const notifList = notifSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                setNotifications(notifList);

                const userDoc = await getDoc(doc(db, "users", loggedInUser.uid));
                if (userDoc.exists()) {
                    setIsPublic(userDoc.data().isPublic || false);
                }

                //step1 : 
                const educationSnapshot = await getDocs(
                    collection(db, "users", loggedInUser.uid, "educations")
                );

                //step 2: 
                const educationsList = await Promise.all(
                    educationSnapshot.docs.map(async (eduDoc) => {
                        const eduId = eduDoc.id;
                        //fetch mandatory courses: 
                        const mandatorySnapshot = await getDocs(
                            collection(db, "users", loggedInUser.uid, "educations", eduId, "mandatoryCourses")

                        );

                        // fetch selected courses
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
                            mandatoryCourses: mandatorySnapshot.docs.map(d => ({
                                ...d.data,
                                course_code: d.id,
                                course_name: d.data().courseName,
                                year: d.data().year,
                                semester: d.data().semester,
                                credits_hp: d.data().credits_hp || "",
                                period: d.data().period || "",
                                mandatory: true,
                                elective: false,
                                grade: d.data().grade || "",
                                ...d.data()
                            })),
                            selectedCourses: selectedSnapshot.docs.map(d => ({
                                ...d.data,

                                course_code: d.id,
                                course_name: d.data().courseName,
                                year: d.data().year,
                                semester: d.data().semester,
                                credits_hp: d.data().credits_hp || "",
                                period: d.data().period || "",
                                mandatory: false,
                                elective: true,
                                grade: d.data().grade || "",
                                ...d.data()
                            })),
                        };
                    })
                );

                console.log("✅ Full educations with courses:", educationsList);
                setEducations(educationsList);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    if (loading) return <p>Loading...</p>;
    if (!user) return <p>Please log in</p>;


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
            if (!shareEmail) { alert("Enter an email first!"); return; }

            // find the user by email
            const usersSnapshot = await getDocs(collection(db, "users"));
            const match = usersSnapshot.docs.find(
                (d) => d.data().email?.toLowerCase() === shareEmail.trim().toLowerCase()
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

    // ✅ move this BEFORE the return statement
    const CourseRow = ({ course }) => {
        const [grade, setGrade] = useState(course.grade || "");
        const [isEditing, setIsEditing] = useState(false);

        async function handleSaveGrade() {
            try {
                await saveCourse(
                    course.educationId,
                    course.mandatory ? "mandatory" : "selectedCourses",
                    course.course_code,
                    { grade: grade }
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
                <span className="course-hp">{course.credits_hp ? `${course.credits_hp}hp` : ""}</span>
                <span className="course-year">{course.year ? `Year ${course.year}` : ""}</span>
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
                            <button className="grade-btn" onClick={handleSaveGrade}>Save</button>
                        </>
                    ) : (
                        <>
                            <span>{grade || "—"}</span>
                            <button className="grade-btn" onClick={() => setIsEditing(true)}>Edit</button>
                        </>
                    )}
                </div>
            </div>
        );
    };


    return (
        <div>
            <Login />
            {/* <h1>Welcome to the Account Page</h1> */}
            {/* <Stats_Window /> */}
            <OtherProfile />
            <div>
                <h2>Profile Visibility</h2>
                <label>
                    <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={handleToggleVisibility}
                    />
                    {isPublic ? "Public — anyone can see your profile" : "Private — only you can see your profile"}
                </label>
            </div>

            {notifications.length > 0 && (
                <div>
                    <h2>🔔 Notifications</h2>
                    {notifications.map((notif) => (
                        <div key={notif.id}>
                            <p>{notif.message}</p>
                        </div>
                    ))}
                </div>
            )}
            {/* User types email → look up their uid in Firestore 
            → add uid to sharedWith array → they can now edit */}
            <div>
                <h2>Share with someone</h2>
                <input
                    type="text"
                    placeholder="Enter their email"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                />
                <button onClick={handleAddCollaborator}>Give Access</button>
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