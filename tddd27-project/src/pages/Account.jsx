import { useState } from "react";
import { Login, Autocomplete, Course } from "../components/common";
import CoursesTable from "../components/common/courses_tabell/CoursesTable";

function Account() {
    const [courses, setCourses] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const programOptions = [
        { name: "Civilingenjörsprogram i medieteknik (MT)", filePath: "/src/assets/data/MT.json" },
        { name: "Civilingenjörsprogram i medieteknik och AI (MT_AI)", filePath: "/src/assets/data/MT-AI.json" },
        { name: "Civilingenjörsprogram i elektronik och systemdesign (ED)", filePath: "/src/assets/data/ESD.json" },
        { name: "Civilingenjörsprogram i medicinsk teknik", filePath: "/src/assets/data/MTK.json" },
        { name: "Civilingenjörsprogram i mjukvaruteknik", filePath: "/src/assets/data/MVK.json" },
        { name: "Civilingenjörsprogram i informationsteknologi (IT)", filePath: "/src/assets/data/IT.json" },
        { name: "Civilingenjörsprogram i datateknik (DT)", filePath: "/src/assets/data/DT.json" },
    ];

    const handleProgramChange = async (program) => {
        setSelectedProgram(program);
        setSelectedCourse(null);

        if (!program?.filePath) {
            setCourses([]);
            return;
        }

        try {
            const response = await fetch(program.filePath);
            const data = await response.json();
            setCourses(data.courses || []);
        } catch (error) {
            console.error("Could not load courses:", error);
            setCourses([]);
        }
    };

    return (
        <div className="account">
            <Login />
            <h1>Account Page</h1>

            <div className="program-row">
                <span>Välja ditt program:</span>
                <Autocomplete
                    options={programOptions}
                    label="Välj program"
                    value={selectedProgram}
                    getOptionLabel={(option) => option?.name || ""}
                    onChange={handleProgramChange}
                />
            </div>

            <Course
                courses={courses}
                selectedCourse={selectedCourse}
                setSelectedCourse={setSelectedCourse}
            />



            <CoursesTable courses={selectedCourse ? [selectedCourse] : courses} />
        </div>
    );
}

export default Account;