import "./Popup.css";
import { useState, useEffect } from "react";

import Rating from "../rating/Rating";
import { getCourse, saveCourse } from "../../../fireBase/userData";

function Popup({ selectedCourse = null, educationId = null }) {

    const [grade, setGrade] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    // Load saved grade from Firebase whenever the selected course changes
    useEffect(() => {
        console.log("Popup received:", { educationId, courseCode: selectedCourse?.course_code });
        console.log("educationId:", educationId);
        console.log("course_code:", selectedCourse?.course_code);

        if (!selectedCourse?.course_code || !educationId) {
            setGrade("");
            setLoading(false);
            return;
        }

        setLoading(true);
        setIsEditing(false);

        getCourse(educationId, "mandatory", selectedCourse.course_code)
            .then((data) => {
                setGrade(data?.grade || "");
            })
            .catch((err) => {
                console.error("Failed to load grade:", err);
                setGrade("");
            })
            .finally(() => setLoading(false));
    }, [selectedCourse?.course_code, educationId]);


    // to change later to make it popup when user clicks on a course in the table 
    if (!selectedCourse) {
        console.warn("Popup rendered without a selected course!");
        return null;
    }



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
                        Examinator: {selectedCourse.examiner_name || "Unknown Examinator"}
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

                    <button onClick={handleSaveGrade} disabled={loading}>
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