import "./Popup.css";
import { useState, useEffect } from "react";
import { db, auth } from "../../../fireBase/firebase";
import { doc, onSnapshot } from "firebase/firestore";

import Rating from "../rating/Rating";

import { saveCourse } from "../../../fireBase/userData";

function Popup({ selectedCourse = null, educationId = null }) {

    const [grade, setGrade] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    // Load saved grade from Firebase whenever the selected course changes
    useEffect(() => {
        if (!selectedCourse?.course_code || !educationId) {
            setGrade("");
            setLoading(false);
            return;
        }

        setLoading(true);
        setIsEditing(false);

        const user = auth.currentUser;
        if (!user) { setLoading(false); return; }

        let found = false; // ✅ track if either snapshot finds the doc

        const mandatoryRef = doc(db, "users", user.uid, "educations", educationId, "mandatoryCourses", selectedCourse.course_code);
        const selectedRef = doc(db, "users", user.uid, "educations", educationId, "selectedCourses", selectedCourse.course_code);

        const unsubscribeMandatory = onSnapshot(mandatoryRef, (snap) => {
            if (snap.exists()) {
                found = true;
                setGrade(snap.data().grade || "");
                setLoading(false);
            }
        });

        const unsubscribeSelected = onSnapshot(selectedRef, (snap) => {
            if (snap.exists()) {
                found = true;
                setGrade(snap.data().grade || "");
                setLoading(false);
            }
        });

        // ✅ stop loading after 2 seconds if nothing found
        const timeout = setTimeout(() => {
            if (!found) setLoading(false);
        }, 2000);

        return () => {
            unsubscribeMandatory();
            unsubscribeSelected();
            clearTimeout(timeout);
        };

    }, [selectedCourse?.course_code, educationId]);


    const handleSaveGrade = async () => {
        if (isEditing) {
            try {
                await saveCourse(educationId, "mandatory", selectedCourse.course_code, {
                    grade,
                });
                console.log("Grade saved:", grade);
            } catch (error) {
                console.error("Failed to save grade:", error);
            }
        }
        setIsEditing((prev) => !prev);
    };

    return (
        <div className="page_popup">
            <div className="container_popup">

                <div className="top_of_post_it">
                    <p className="popup_course_code">{selectedCourse.course_code}</p>
                </div>

                <p className="popup_course_name">{selectedCourse.course_name}</p>

                <div className="examinator_and_department">
                    <p className="popup_examinator">
                        Examiner: {selectedCourse.examiner_name || "Unknown Examinator"}
                    </p>
                    <p className="popup_department">
                        Department: {selectedCourse.department || "Unknown Department"}
                    </p>
                </div>

                <div className="popup_grade_container">
                    <p className="popup_grade">Grade:</p>

                    {loading ? (
                        <p className="popup_grade_variable">Loading...</p>
                    ) : isEditing ? (
                        <input
                            type="text"
                            className="popup_grade_input"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            autoFocus
                        />
                    ) : (
                        <p className="popup_grade_variable">
                            {grade || "No grade set"}
                        </p>
                    )}

                    <button id="saveProgramButton" onClick={handleSaveGrade} disabled={loading} >
                        {isEditing ? "Save Change" : "Edit Grade"}
                    </button>
                </div>

                <p className="text_before_rating">My rating of the course:</p>
                <Rating courseId={selectedCourse?.course_code} />

            </div>
        </div>
    );
}

export default Popup;