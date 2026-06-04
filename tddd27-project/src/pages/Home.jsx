import { useState, useEffect } from "react";
import {
    Login,
    Course,
} from "../components/common";
import CoursesTable from "../components/common/courses_tabell/CoursesTable";
import { saveCourse } from "../fireBase/userData";
import { auth } from "../fireBase/firebase";
import { onAuthStateChanged } from "firebase/auth";

// JSON files for the different programs
import mtData from "../assets/data/MT_courses.json";
import dtData from "../assets/data/DT_courses.json";
import itData from "../assets/data/IT_courses.json";
import "./Home.css";
function Home() {
    const [courses, setCourses] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedSpecialisation, setSelectedSpecialisation] = useState(null);
    const [user, setUser] = useState(null);

    // Track the currently logged-in user
    useEffect(() => {
        return onAuthStateChanged(auth, (u) => setUser(u));
    }, []);

    const programOptions = [
        {
            id: "MT",
            name: "Civilingenjörsprogram i medieteknik (MT)",
            courses: mtData.courses || [],
            specialisations: mtData.program?.specialisations || [],
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
        },
    ];

    // Resets course and specialisation selection when program changes
    const handleProgramChange = (program) => {
        setSelectedProgram(program);
        setSelectedCourse(null);
        setSelectedSpecialisation(null);
        setCourses(program?.courses || []);
    };

    // Returns true if the course matches the selected specialisation.
    // - No specialisation selected → show all courses
    // - Course has no specialisation (null) → always show (mandatory/general elective)
    // - Otherwise → only show if specialisation matches exactly
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
    // Filters courses to show in the table:
    // - If a course is selected from the autocomplete → show only that course
    // - Otherwise → filter by specialisation
    const visibleCourses = courses.filter((course) => {
        if (!course) return false;
        if (selectedCourse) return course.course_code === selectedCourse.course_code;
        return courseMatchesSpecialisation(course, selectedSpecialisation);
    });

    // Saves all visible specialisation courses at once to Firestore.
    // Called when the user clicks "Save all courses" in the specialisation section.
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
                updatedAt: new Date(),
            });
        }

        alert("All specialisation courses saved!");
    }

    return (
        <div className="account">
            <Login />

            {/* Show welcome message when user is logged in */}

            <div className="welcome-text">
                <h1>Welcome{user ? `, ${user.displayName}!` : " to LiU-Courses!"}</h1>
                <p>
                    {user ? "Need help? " : "New here? "}
                    Check out the <a href="/about">About page</a> to get started.
                </p>
            </div>

            <Course
                programOptions={programOptions}
                selectedProgram={selectedProgram}
                onProgramChange={handleProgramChange}
                courses={courses}
                selectedCourse={selectedCourse}
                setSelectedCourse={setSelectedCourse}
                selectedSpecialisation={selectedSpecialisation}
                setSelectedSpecialisation={setSelectedSpecialisation}
                onSaveAll={handleSaveProfileCourses}
            />

            <CoursesTable
                courses={visibleCourses}
                educationId={selectedProgram?.id}        // for Firebase
                educationName={selectedProgram?.name}    // for display
                setSelectedCourse={setSelectedCourse}
                selectedCourse={selectedCourse}
            />
        </div>
    );
}

export default Home;