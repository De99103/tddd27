import { useState } from "react";
import {
    Login,
    Course,
    Popup,
} from "../components/common";
import CoursesTable from "../components/common/courses_tabell/CoursesTable";
import { saveCourse } from "../fireBase/userData";


//json files for the different programs
import mtData_new from "../assets/data/MT_courses.json"; // the new link for the MT program
import dtData from "../assets/data/DT.json";
import itData from "../assets/data/IT_courses_fixed.json";

function Home() {
    const [courses, setCourses] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedSpecialisation, setSelectedSpecialisation] = useState(null);
    const [filterBySpecialisation, setFilterBySpecialisation] = useState(false);
    const [user, setUser] = useState(null);

    const programOptions = [
        {
            id: "MT",
            name: "Civilingenjörsprogram i medieteknik (MT)", // our program ..
            courses: mtData_new.courses || [],
            specialisations: mtData_new.program?.specialisations || [],

        },
        {
            id: "DT",
            name: "Civilingenjörsprogram i datateknik (DT)",
            courses: dtData.courses || [],
            specialisations: dtData.program?.specialisations || [],

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

        if (spec == null) return course.ecv === true;

        if (Array.isArray(spec)) {
            return spec
                .map(s => s.trim())
                .includes(selectedSpecialisation.trim());
        }

        return spec.trim() === selectedSpecialisation.trim();
    };

    const visibleCourses = courses.filter((course) => {
        if (!course) return false;
        if (selectedCourse) return course.course_code === selectedCourse.course_code; // to filter by the selected course if there is one
        return courseMatchesSpecialisation(course, selectedSpecialisation);
    });

    const selectedProfileCourses = visibleCourses.filter((course) => {
        return course.ecv === true || course.ecv === true;
    });


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
            const courseType = course.mandatory === true ? "mandatory" : "selectedCourses";
            await saveCourse(educationId, courseType, course.course_code, {
                courseName: course.course_name,
                masterProfile: selectedSpecialisation,
                courseSpecialisation: course.specialisation || null,
                year: course.year || "",
                semester: course.semester || "",
                ecv: course.ecv || "",
                updatedAt: new Date(),
            });
        }

        alert("All specialisation courses saved!");
    }

    return (

        <div className="account">
            <Login />

            {/* <h1>Welcome, {user.displayName} !</h1> */} {/* to fix!  */}

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
                onSaveAll={handleSaveProfileCourses}

            />

            <CoursesTable
                courses={visibleCourses}
                educationId={selectedProgram?.id}        //  for Firebase
                educationName={selectedProgram?.name}    //  for display                
                setSelectedCourse={setSelectedCourse}
                selectedCourse={selectedCourse} 
            />

        </div>
    );
}

export default Home;
