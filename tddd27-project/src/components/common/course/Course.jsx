import "./Course.css";
import Autocomplete from "../autocomplete/Autocomplete";
import { saveProgram } from "../../../fireBase/userData";

function Course({
    programOptions = [],
    selectedProgram = null,
    onProgramChange = () => { },
    courses = [],
    selectedCourse = null,
    setSelectedCourse = () => { },
}) {
    return (
        <div className="page">
            <div className="course-container">
                <div className="textAndInput">
                    <p>
                        Programnamn/ <i>Program name:</i>
                    </p>
                    <Autocomplete
                        options={programOptions}
                        label=""
                        className="line-autocomplete"
                        value={selectedProgram}
                        getOptionLabel={(option) => option?.name || ""}
                        onChange={(program) => {
                            onProgramChange(program);
                            saveProgram(program?.code || program?.name || "");
                        }}
                    />
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
                                option ? `${option.course_code} - ${option.course_name}` : ""
                            }
                            onChange={setSelectedCourse}
                        />
                    </div>

                    <div className="titleAndDepartment">
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
                            <div className="textAndInput">
                                <p>
                                    Betyg/<i>Grade:</i>
                                </p>
                                <input name="input_grade" type="text" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Course;
