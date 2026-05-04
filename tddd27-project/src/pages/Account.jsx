import { useState } from "react";
import { Login, Course } from "../components/common";
import CoursesTable from "../components/common/courses_tabell/CoursesTable";
import { deleteAccount } from "../fireBase/deleteUser";

//json files for the different programs
import mtData from "../assets/data/MT.json"; // the old link 
import mtData_new from "../assets/data/MT_courses.json"; // the new link for the MT program 
import mtAiData from "../assets/data/MT-AI.json";
import dtData from "../assets/data/DT.json";
import edData from "../assets/data/ED.json";

import it_data from "../assets/data/IT_courses.json"; // the new link for the IT program

// async function handleDeleteAccount() {
//   try {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete your account?"
//     );

//     if (!confirmDelete) return;

//     await deleteAccount();

//     alert("Account deleted.");
//   } catch (error) {
//     console.error("Error deleting account:", error);
//   }
// }


function Account() {
    const [courses, setCourses] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const programOptions = [
        {
            id: "MT",
            name: "Civilingenjörsprogram i medieteknik (MT)", // our program .. 
            courses: mtData_new.courses || [],
        },
        {
            id: "MT_AI",
            name: "Civilingenjörsprogram i medieteknik och AI (MT_AI)", // the new MT program with AI 
            courses: mtAiData.courses || [],
        },
        {
            id: "DT",
            name: "Civilingenjörsprogram i datateknik (DT)",
            courses: dtData.courses || [],
        },
        {
            id : "ED", 
            name : "Civilingenjörsprogram i elektronikdesign (ED)",
            courses : edData.courses|| []
        },
        {
            id : "IT", 
            name : "Civilingenjörsprogram i informationsteknologi (IT)",
            courses : it_data.courses|| []
        }
    ];

    const handleProgramChange = (program) => {
        setSelectedProgram(program);
        setSelectedCourse(null);
        setCourses(program?.courses || []);
    };

    return (
        <div className="account">
            <Login />
            
            <h1>Account Page</h1>

            <Course
                programOptions={programOptions}
                selectedProgram={selectedProgram}
                onProgramChange={handleProgramChange}
                courses={courses}
                selectedCourse={selectedCourse}
                setSelectedCourse={setSelectedCourse}
            />

            <CoursesTable courses={selectedCourse ? [selectedCourse] : courses} />
        </div>
    );
}

export default Account;
