import "./CoursesTable.css";
import Popup from "../popup/Popup";
import { useState } from "react";

const CoursesTable = ({ courses = [], educationId = null }) => {
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
                                                    key={`${course.course_code}-${course.specialisation ?? "none"}`}
                                                    className={`course-card ${course.elective ? "selectable" : "mandatory"}`}
                                                    onClick={() => setPopupCourse(course)} // ✅ open popup on click
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

                                                        {course.elective && (
                                                            <button
                                                                className="add-btn"
                                                                onClick={(e) => e.stopPropagation()}
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