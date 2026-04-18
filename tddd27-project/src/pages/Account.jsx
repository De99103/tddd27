import { Course, Login } from "../components/common";

import { useState } from "react";
import { Autocomplete } from "../components/common";
import CoursesTable from "../components/common/courses_tabell/CoursesTable";

import "./Account.css";

function Account() {
    const [courses, setCourses] = useState([]);

    return (
        <div className="account">
            <Login />

            <h1>Account Page</h1>
            <p>This is the account page.</p>

             <div className="program-row">
                <span>Välja ditt program:</span>
                <Autocomplete onCoursesLoaded={setCourses} />
            </div>

            <CoursesTable courses={courses} />
        </div>
    );
}

export default Account;