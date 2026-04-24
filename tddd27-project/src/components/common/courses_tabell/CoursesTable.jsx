import "./CoursesTable.css";

const CoursesTable = ({ courses = [] }) => {
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
                                                key={course.course_code}
                                                className={`course-card ${
                                                    course.elective
                                                        ? "selectable"
                                                        : "mandatory"
                                                }`}
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
                                                        <button className="add-btn">
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
    );
};

export default CoursesTable;