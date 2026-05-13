import "./CoursesTable.css";
import Popup from "../popup/Popup";
import { useState } from "react";
import { db } from "../../../fireBase/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { saveCourse } from "../../../fireBase/userData";

const CoursesTable = ({ courses = [], educationId = null }) => {
    console.log("CoursesTable courses count:", courses.length);  // ADD THIS
    console.log("CoursesTable specialisations:", [...new Set(courses.map(c => c.specialisation))]); // ADD THIS
    console.log("CoursesTable ALL courses:", courses.map(c => `${c.course_code} | ${c.specialisation} | ${c.ecv}`));


    const [popupCourse, setPopupCourse] = useState(null);

    const groupedCourses = courses.reduce((acc, course) => {
        const year = course.year || "Unknown";
        const semester = course.semester || "Unknown";

        if (!acc[year]) acc[year] = {};
        if (!acc[year][semester]) acc[year][semester] = [];

        acc[year][semester].push(course);
        return acc;
    }, {});

    const sortedYears = Object.keys(groupedCourses).sort(
        (a, b) => Number(a) - Number(b)
    );


    const addcourse = async (e, course) => {
        e.stopPropagation();

        try {
            await saveCourse(
                educationId,
                "selected",
                course.course_code,
                {
                    ...course,
                    grade: "",
                }
            );

            console.log("Course added:", course.course_code);
        } catch (error) {
            console.error("Error adding course:", error);
        }

        alert("Course added:"  + course.course_name + " " +  course.course_code ) ;
    };
    // Find courses that appear in multiple semesters
    const courseCodeCount = courses.reduce((acc, course) => {
        if (!acc[course.course_code]) {
            acc[course.course_code] = new Set();
        }

        acc[course.course_code].add(course.semester);

        return acc;
    }, {});

    const multiSemesterCodes = Object.entries(courseCodeCount)
        .reduce((acc, [code, semesters]) => {
            acc[code] = [...semesters];
            return acc;
        }, {});

    return (
        <>
            {popupCourse && (
                <div
                    className="popup-overlay"
                    onClick={() => setPopupCourse(null)}
                >
                    <div
                        className="popup-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Popup
                            selectedCourse={popupCourse}
                            educationId={educationId}
                        />
                    </div>
                </div>
            )}

            <div className="courses-wrapper">
                {sortedYears.map((year) => {
                    const semesters = groupedCourses[year];
                    const sortedSemesters = Object.keys(semesters).sort(
                        (a, b) => Number(a) - Number(b)
                    );

                    return (
                        <section key={year} className="year-section">
                            <h2 className="year-title">Year {year}</h2>

                            <div className="semester-grid">
                                {sortedSemesters.map((semester) => (
                                    <div key={semester} className="semester-column">
                                        <h3 className="semester-title">
                                            Semester {semester}
                                        </h3>

                                        <div className="course-grid">
                                            {semesters[semester].map((course) => (
                                                <div
                                                    key={`${course.course_code}-${course.year}-${course.semester}-${course.specialisation ?? "none"}`}
                                                    className={`course-card ${course.elective ? "selectable" : "mandatory"}`}
                                                    onClick={() => setPopupCourse(course)} //  open popup on click
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    <div className="course-code-box">
                                                        {course.course_code}
                                                    </div>

                                                    <div className="course-body">
                                                        <h4 className="course-name">
                                                            {course.course_name}
                                                        </h4>

                                                        <div className="course-details">
                                                            <p>{course.credits_hp} hp</p>
                                                            <p>Period {course.period}</p>
                                                        </div>
                                                        {(() => {
                                                            const otherSemesters =
                                                                multiSemesterCodes[course.course_code]
                                                                    ?.filter(s => Number(s) !== Number(course.semester)) || [];

                                                            if (otherSemesters.length === 0) return null;

                                                            return (
                                                                <p className="also-available">
                                                                    📅 Also available in semester {otherSemesters.join(", ")}
                                                                </p>
                                                            );
                                                        })()}

                                                        {course.elective && (
                                                            <button
                                                                className="add-btn"
                                                                onClick={(e) => addcourse(e, course)}
                                                            >
                                                                Add course
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    );
                })}
            </div>
        </>
    );
};

export default CoursesTable;