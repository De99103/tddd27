import "./Course.css";
import Autocomplete from "../autocomplete/Autocomplete";
import { useState } from "react";

import { saveCourse, savePublicCourseRating } from "../../../fireBase/userData";
import { writeBatch, doc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../../fireBase/firebase";


import infoIcon from "/src/assets/images/info.png";
function Course({
    programOptions = [],
    selectedProgram = null,
    onProgramChange = () => { },

    courses = [],
    selectedCourse = null,
    setSelectedCourse = () => { },

    selectedSpecialisation = null,
    setSelectedSpecialisation = () => { },

    onSaveAll = () => { },
}) {
    const specialisations = selectedProgram?.specialisations || [];

    const [educationName, setEducationName] = useState("");
    const [courseGrade, setCourseGrade] = useState("");
    const [masterCourse, setMasterCourse] = useState("");
    const [profile, setProfile] = useState("");
    const [notes, setNotes] = useState("");
    const [courseRating, setCourseRating] = useState("");
    const [specialisation, setSpecialisation] = useState(false);

    const handleSpecialisationToggle = (e) => {
        const checked = e.target.checked;
        setSpecialisation(checked);
        if (!checked) {
            setSelectedSpecialisation(null);
        }
    };

    async function handleSave() {
        try {
            if (!selectedProgram) { alert("Select a program first!"); return; }
            if (!selectedCourse) { alert("Select a course first!"); return; }

            const educationId = selectedProgram.id || selectedProgram.name;
            const courseId = selectedCourse.course_code;
            const courseType = selectedCourse.mandatory === true ? "mandatory" : "selectedCourses";

            await saveCourse(educationId, courseType, courseId, {
                courseName: selectedCourse.course_name,
                grade: courseGrade,
                notes: notes,
                rating: courseRating,
                masterProfile: selectedSpecialisation || null,
                courseSpecialisation: selectedCourse.specialisation || null,
                year: selectedCourse.year,
                semester: selectedCourse.semester,
                ecv: selectedCourse.ecv,
                updatedAt: new Date(),
            });

            // ✅ batch write for all mandatory courses
            if (selectedCourse.mandatory === true) {
                const mandatoryCourses = courses.filter(
                    (c) => c.mandatory === true && c.course_code !== courseId
                );

                const batch = writeBatch(db);

                for (const course of mandatoryCourses) {
                    const ref = doc(
                        db,
                        "users", auth.currentUser.uid,
                        "educations", educationId,
                        "mandatoryCourses", course.course_code
                    );
                    batch.set(ref, {
                        courseName: course.course_name,
                        grade: "",
                        masterProfile: null,
                        courseSpecialisation: course.specialisation || null,
                        year: course.year ?? "",
                        semester: course.semester ?? "",
                        ecv: course.ecv ?? "",
                        updatedAt: serverTimestamp(),
                    }, { merge: true });
                }

                await batch.commit();
            }

            await savePublicCourseRating(courseId, {
                grade: courseGrade,
                rating: courseRating,
            });

            alert("Saved!");

        } catch (error) {
            console.error("Error saving:", error);
            alert("Error: " + error.message);
        }
    }

    return (
        <div className="page">
            <div className="course-container">
                <div className="textAndInput">
                    <p>
                        Programnamn/ <i>Program name:</i>
                    </p>
                    <div className="program_name_and_button">
                        <Autocomplete
                            options={programOptions}
                            label=""
                            className="line-autocomplete"
                            value={selectedProgram}
                            getOptionLabel={(option) => option?.name || ""}
                            onChange={(program) => {
                                onProgramChange(program);
                                // saveProgram(program?.code || program?.name || "");
                            }}
                        />
                        {/* <button id="saveProgramButton" onClick={handleSave}>Save</button> */}
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
                            className="line-autocomplete"
                            value={selectedCourse}
                            getOptionLabel={(option) =>
                                option
                                    ? `${option.course_code} - ${option.course_name}
                                    `
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
                                readOnly
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

                    <div className="specialisation-toggle">
                        <button id="saveButton" onClick={handleSave}>
                            Save this course
                        </button>
                        <div className="checkbox_div">
                            <input
                                type="checkbox"
                                checked={specialisation}
                                onChange={handleSpecialisationToggle}
                            />
                            <p>
                                Lägger till Masterprofil/<i>specialization</i>
                            </p>
                        </div>
                    </div>

                    {specialisation && (
                        <div className="specialisation_div">
                            <div className="autocomplete-with-info">
                                <p>
                                    Masterprofil/<i> Specialization:</i>
                                </p>
                                <Autocomplete
                                    options={specialisations}
                                    label=""
                                    className="line-autocomplete"
                                    value={selectedSpecialisation}
                                    getOptionLabel={(option) => option || ""}
                                    onChange={(value) => {
                                        setSelectedSpecialisation(value);
                                    }}
                                />
                                <div className="info-btn-wrapper">
                                    <img
                                        src={infoIcon}
                                        alt="info Button"
                                        className="info-icon"
                                    />

                                    <div className="info-tooltip">
                                        Selecting a specialization filters the course table to show only relevant courses.
                                        Use <b>Save all courses</b> to save them all at once, or add courses individually.
                                        You can also add or remove courses on the Account page.
                                    </div>
                                </div>
                                <div className="save-all-row">
                                    <button
                                        id="saveButton"
                                        onClick={onSaveAll}
                                        disabled={!selectedSpecialisation}
                                    >
                                        Save all courses
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Course;
