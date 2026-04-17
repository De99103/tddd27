import "./Course.css";

function Course() {
    return (
        <div className="page">
            <div className="course-container">
                <div className="codeAndGrade">
                    <div className="textAndInput">
                        <p>
                            Utbildingskod/<i>Education code:</i>
                        </p>
                        <input name="input_courseCode" type="text"></input>
                    </div>

                    <div className="textAndInput">
                        <p>
                            Betyg/<i>Grade:</i>
                        </p>
                        <input name="input_grade" type="text"></input>
                    </div>
                </div>

                <div className="titleAndDepartment">
                    <div className="textAndInput">
                        <p>
                            Kursnamn/<i>Course title:</i>
                        </p>
                        <input name="input_courseTitle" type="text"></input>
                    </div>

                    <div className="textAndInput">
                        <p>
                            Institution/<i>Department:</i>
                        </p>
                        <input name="input_department" type="text"></input>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Course;
