import "./Course.css";

function Course() {
    return (
        <body>
            <div className="course-container">
                <div className="codeAndModule">
                    <p>
                        Utbildingskod/<i>Education code:</i>
                    </p>
                    <p>
                        Modul/<i>Module:</i>
                    </p>
                </div>

                <p>
                    Kursnamn/<i>Course title:</i>
                </p>
                <p>
                    Institution/<i>Department:</i>
                </p>
            </div>
        </body>
    );
}

export default Course;
