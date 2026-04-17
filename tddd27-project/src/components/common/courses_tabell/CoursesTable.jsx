import "./CoursesTable.css";

const CoursesTable = ({ courses = [] }) => {
    return (
        <div className="courses-table-wrapper">
            <table className="courses-table">
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>Semester</th>
                        <th>Code</th>
                        <th>Course</th>
                        <th>Credits</th>
                        <th>Period</th>
                    </tr>
                </thead>

                <tbody>
                    {courses.map((course) => (
                        <tr key={course.course_code}>
                            <td>{course.year}</td>
                            <td>{course.semester}</td>
                            <td>{course.course_code}</td>
                            <td>{course.course_name}</td>
                            <td>{course.credits_hp}</td>
                            <td>{course.period}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CoursesTable;