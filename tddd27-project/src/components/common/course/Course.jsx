import "./Course.css";
import Autocomplete from "../autocomplete/Autocomplete";
import { useState } from "react";

//should this be a page or a component ? or not here at all??
import { saveCourse, savePublicCourseRating } from "../../../fireBase/userData";

function Course({
    programOptions = [],
    selectedProgram = null,
    onProgramChange = () => {},
    courses = [],
    selectedCourse = null,
    setSelectedCourse = () => {},
}) {
    const [educationName, setEducationName] = useState("");
    const [courseGrade, setCourseGrade] = useState("");
    const [masterCourse, setMasterCourse] = useState("");
    const [profile, setProfile] = useState("");
    const [notes, setNotes] = useState("");
    const [courseRating, setCourseRating] = useState("");

    async function handleSave() {
        try {
            if (!selectedProgram) {
                alert("Select an education/program first!");
                return;
            }

            if (!selectedCourse) {
                alert("Select a course before saving!");
                return;
            }

            const educationId = selectedProgram.code || selectedProgram.name;
            const courseId = selectedCourse.course_code;

            if (!educationId || !courseId) {
                alert("Missing education ID or course ID");
                return;
            }

            await saveCourse(educationId, "mandatory", courseId, {
                grade: courseGrade,
                notes: notes,
                rating: courseRating,
            });

            await savePublicCourseRating(courseId, {
                grade: courseGrade,
                rating: courseRating,
            });

            alert("Saved!");
        } catch (error) {
            console.error("Error saving:", error);
        }
    }

    return (
        <div className="page">
            <div className="course-container">
                <div className="textAndInput">
                    <p>
                        Programnamn/ <i>Program name:</i>
                    </p>

                    <div className="program_name_and_save_button">
                        <Autocomplete
                            options={programOptions}
                            label=""
                            className="input"
                            value={selectedProgram}
                            getOptionLabel={(option) => option?.name || ""}
                            onChange={(program) => {
                                onProgramChange(program);
                                // saveProgram(program?.code || program?.name || "");
                            }}
                        />
                        <button onClick={handleSave}>Save</button>
                    </div>
                </div>

                <div className="codeAndGrade">
                    <div className="textAndInput">
                        <p>
                            Kursnamn/<i>Course title:</i>
                        </p>

                        <Autocomplete
                            options={courses}
                            label=""
                            className="input"
                            value={selectedCourse}
                            getOptionLabel={(option) =>
                                option
                                    ? `${option.course_code} - ${option.course_name}`
                                    : ""
                            }
                            onChange={setSelectedCourse}
                        />
                    </div>

                    <div className="departmentAndGrade">
                        <div className="textAndInput" id="department_container">
                            <p>
                                Institution/<i>Department:</i>
                            </p>
                            <input
                                className="input"
                                type="text"
                                value={selectedCourse?.department || ""}
                                readOnly // we don't want users to edit this field, it's just for display
                            />
                        </div>
                        <div className="textAndInput" id="grade_container">
                            <p>
                                Betyg/<i>Grade:</i>
                            </p>
                            <input
                                className="input"
                                type="text"
                                value={courseGrade}
                                onChange={(e) => setCourseGrade(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Course;
