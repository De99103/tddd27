import { useState } from "react";
import {
    Login,
    Course,
  //  DeleteAccountButton,
    Popup,
} from "../components/common";
import CoursesTable from "../components/common/courses_tabell/CoursesTable";
import { deleteAccount } from "../fireBase/deleteUser";
import { saveCourse } from "../fireBase/userData";


//json files for the different programs
import mtData from "../assets/data/MT.json"; // the old link
import mtData_new from "../assets/data/MT_courses_fixed.json"; // the new link for the MT program
import mtAiData from "../assets/data/MT-AI.json";
import dtData from "../assets/data/DT.json";
import edData from "../assets/data/ED.json";
import itData from "../assets/data/IT_courses.json";

function Home() {
    const [courses, setCourses] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedSpecialisation, setSelectedSpecialisation] = useState(null);
    const [filterBySpecialisation, setFilterBySpecialisation] = useState(false);

    const programOptions = [
        {
            id: "MT",
            name: "Civilingenjörsprogram i medieteknik (MT)", // our program ..
            courses: mtData_new.courses || [],
            specialisations: mtData_new.program?.specialisations || [],

        },
        {
            id: "MT_AI",
            name: "Civilingenjörsprogram i medieteknik och AI (MT_AI)", // the new MT program with AI
            courses: mtAiData.courses || [],
            specialisations: mtAiData.program?.specialisations || [],
        },
        {
            id: "DT",
            name: "Civilingenjörsprogram i datateknik (DT)",
            courses: dtData.courses || [],
            specialisations: dtData.program?.specialisations || [],

        },
        {
            id: "ED",
            name: "Civilingenjörsprogram i elektronikdesign (ED)",
            courses: edData.courses || [],
            specialisations: edData.program?.specialisations || [],

        },
        {
            id: "IT",
            name: "Civilingenjörsprogram i informationsteknologi (IT)",
            courses: itData.courses || [],
            specialisations: itData.program?.specialisations || [],

        }
    ];

    const handleProgramChange = (program) => {
        setSelectedProgram(program);
        setSelectedCourse(null);
        setSelectedSpecialisation(null);
        setCourses(program?.courses || []);
        setFilterBySpecialisation(false);


    };
    const courseMatchesSpecialisation = (course, selectedSpecialisation) => {
        if (!selectedSpecialisation) return true;

        const spec = course.specialisation;

        // to showing the mandatory courses too 
        if (spec == null) return course.ecv === "C";

        if (Array.isArray(spec)) {
            return spec
                .map(s => s.trim())
                .includes(selectedSpecialisation.trim());
        }

        return spec.trim() === selectedSpecialisation.trim();
    };

    const visibleCourses = courses.filter((course) => {
        if (!course) return false;
        return courseMatchesSpecialisation(course, selectedSpecialisation);
    });

    const selectedProfileCourses = visibleCourses.filter((course) => {
        return course.ecv === "C" || course.ecv === "E";
    });

    // // Deduplicate: keep only the first occurrence of each course_code
    // const seenCodes = new Set();
    // const deduplicatedCourses = visibleCourses.filter((course) => {
    //     if (seenCodes.has(course.course_code)) return false;
    //     seenCodes.add(course.course_code);
    //     return true;
    // });


    //debug 
    console.log("selectedSpecialisation:", selectedSpecialisation);
    console.log("visibleCourses count:", visibleCourses.length);
    console.log("sample specialisations:", [...new Set(visibleCourses.map(c => c.specialisation))]);


    async function handleSaveProfileCourses() {
    if (!selectedProgram || !selectedSpecialisation) {
        alert("Choose program and specialisation first");
        return;
    }

    const educationId = selectedProgram.id || selectedProgram.code || selectedProgram.name;

    for (const course of visibleCourses) {
        await saveCourse(educationId, "selectedCourses", course.course_code, {
            courseName: course.course_name,
            masterProfile: selectedSpecialisation,
            courseSpecialisation: course.specialisation || null,
            year: course.year,
            semester: course.semester,
            ecv: course.ecv,
            updatedAt: new Date(),
        });
    }

    alert("All specialisation courses saved!");
}

    return (

        <div className="account">
            <Login />

            <h1>Home Page</h1>


            <Course
                programOptions={programOptions}
                selectedProgram={selectedProgram}
                onProgramChange={handleProgramChange}
                courses={courses}
                selectedCourse={selectedCourse}
                setSelectedCourse={setSelectedCourse}
                selectedSpecialisation={selectedSpecialisation}
                setSelectedSpecialisation={setSelectedSpecialisation} // function 
                selectedProfileCourses={selectedProfileCourses} // data 

            />



            {/* <Popup
                selectedCourse={selectedCourse}
                educationId={selectedProgram?.code || selectedProgram?.name}
            />             */}



            <CoursesTable
                courses={visibleCourses}
                educationId={selectedProgram?.name}
                setSelectedCourse={setSelectedCourse}
            />

        </div>
    );
}

export default Home;
