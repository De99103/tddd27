import "./Course.css";
import Autocomplete from "../autocomplete/Autocomplete";
import { useState } from "react";

//should this be a page or a component ? or not here at all??
import { saveCourse, savePublicCourseRating } from "../../../fireBase/userData";

function Course({
    programOptions = [],
    selectedProgram = null,
    onProgramChange = () => { },

    courses = [],
    selectedCourse = null,
    setSelectedCourse = () => { },

    selectedSpecialisation = null,
    setSelectedSpecialisation = () => { },

}) {
    const specialisations = selectedProgram?.specialisations || [];

    const [educationName, setEducationName] = useState("");
    const [courseGrade, setCourseGrade] = useState("");
    const [masterCourse, setMasterCourse] = useState("");
    const [profile, setProfile] = useState("");
    const [notes, setNotes] = useState("");
    const [courseRating, setCourseRating] = useState("");
    const [specialisation, setSpecialisation] = useState("")

    // const visibleCourses = courses.filter((course) => {
    //     if (!course) return false;

    //     // Compulsory courses with no specialisation = always visible (e.g. year 1-3 core)
    //     if (course.ecv === "C" && course.specialisation === null) return true;

    //     // If no specialisation selected, only show null-specialisation courses
    //     if (!selectedSpecialisation) {
    //         return course.specialisation === null;
    //     }

    //     // With a specialisation selected:
    //     // Show courses belonging to that specialisation (both C and E)
    //     if (Array.isArray(course.specialisation)) {
    //         if (course.specialisation.includes(selectedSpecialisation)) {
    //             return true;
    //         }
    //     } else if (course.specialisation === selectedSpecialisation) {
    //         return true;
    //     }
    //     // Also show general electives (null specialisation)
    //     if (course.specialisation === null) return true;

    //     return false;
    // });


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

            // await saveCourse(educationId, "mandatory", courseId, {
            //     grade: courseGrade,
            //     notes: notes,
            //     rating: courseRating,
            // });

            await saveCourse(educationId, "selectedCourses", courseId, {
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

            console.log("selectedSpecialisation:", selectedSpecialisation);
            console.log("selectedCourse:", selectedCourse);
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
                        <button id="saveProgramButton" onClick={handleSave}>Save</button>
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
                                    ? `${option.course_code} - ${option.course_name}${option.specialisation ? ` (${option.specialisation})` : ""
                                    }`
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

                    <div className="profiles-div">
                        <div className="textAndInput">

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
                                    console.log("Specialisation onChange fired:", value);
                                    setSelectedSpecialisation(value)
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Course;
