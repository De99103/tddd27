import "./Course.css";

function Course() {
    return (
        <div className="page">
            <div className="course-container">
                <div className="codeAndModule">
                    <p>
                        Utbildingskod/
                        <i>
                            Education code: <input name="input_courseCode" type="text"></input>
                        </i>
                    </p>

                    <p>
                        Modul/
                        <i>
                            Module: <input name="input_module" type="text"></input>
                        </i>
                    </p>
                </div>

                <p>
                    Kursnamn/
                    <i>
                        Course title: <input name="input_courseTitle" type="text"></input>
                    </i>
                </p>
                <p>
                    Institution/
                    <i>
                        Department: <input name="input_department" type="text"></input>
                    </i>
                </p>
            </div>
        </div>
    );
}

export default Course;
