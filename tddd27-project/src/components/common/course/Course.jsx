import "./Course.css";
import Autocomplete from "../autocomplete/Autocomplete";

function Course({ courses, selectedCourse, setSelectedCourse }) {
    return (
        <div className="page">
            <div className="course-container">
                <div className="codeAndGrade">
                    <div className="textAndInput">
                        <p>
                            Utbildingskod/<i>Education code:</i>
                        </p>
                        <input
                            name="input_courseCode"
                            type="text"
                            value={selectedCourse?.course_code || ""}
                            readOnly
                        />
                    </div>

                    <div className="textAndInput">
                        <p>
                            Betyg/<i>Grade:</i>
                        </p>
                        <input name="input_grade" type="text" />
                    </div>
                </div>

                <div className="titleAndDepartment">
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
                                option ? `${option.course_code} - ${option.course_name}` : ""
                            }
                            onChange={setSelectedCourse}
                        />
                    </div>

                    <div className="textAndInput">
                        <p>
                            Institution/<i>Department:</i>
                        </p>
                        <input
                            name="input_department"
                            type="text"
                            value={selectedCourse?.department || ""}
                            readOnly
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Course;