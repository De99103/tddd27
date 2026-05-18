import { Course, Login, Stats_Window, OtherProfile } from "../components/common";
import { useState, useEffect } from "react";

import { auth, db } from "../fireBase/firebase"
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function Account() {
    const [user, setUser] = useState(null);
    const [educations, setEducations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (loggedInUser) => {
            if (loggedInUser) {
                setUser(loggedInUser);

                //step1 : 
                const educationSnapshot = await getDocs(
                    collection(db, "users", loggedInUser.uid, "educations")
                );

                //step 2: 
                const educationsList = await Promise.all(
                    educationSnapshot.docs.map(async (eduDoc) => {
                        const eduId = eduDoc.id;
                        //fetch mandatory courses: 
                        const mandatorySnapshot = await getDocs(
                            collection(db, "users", loggedInUser.uid, "educations", eduId, "mandatoryCourses")

                        );

                        // fetch selected courses
                        const selectedSnapshot = await getDocs(
                            collection(db, "users", loggedInUser.uid, "educations", eduId, "selectedCourses")
                        );

                        return {
                            id: eduId,
                            ...eduDoc.data(),
                            mandatoryCourses: mandatorySnapshot.docs.map(d => ({ id: d.id, ...d.data() })),
                            selectedCourses: selectedSnapshot.docs.map(d => ({ id: d.id, ...d.data() })),
                        };
                    })
                );

                console.log("✅ Full educations with courses:", educationsList);
                setEducations(educationsList);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    if (loading) return <p>Loading...</p>;
    if (!user) return <p>Please log in</p>;




    return (
        <div>
            <Login />
            {/* <h1>Welcome to the Account Page</h1> */}
            {/* <Stats_Window /> */}
            <OtherProfile />

            <h2>Your Educations</h2>
            {educations.length === 0 ? (
                <p>No educations saved yet.</p>
            ) : (
                educations.map((edu) => (
                    <div key={edu.id}>
                        <h3>{edu.id}</h3>

                      {/* Mandatory Courses */}
            {edu.mandatoryCourses.length > 0 && (
              <div>
                <h4>Mandatory Courses</h4>
                {edu.mandatoryCourses.map((course) => (
                  <div key={course.id}>
                    <p>{course.id} — {course.courseName}</p>
                    <p>Grade: {course.grade || "—"}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Selected Courses */}
            {edu.selectedCourses.length > 0 && (
              <div>
                <h4>Selected Courses</h4>
                {edu.selectedCourses.map((course) => (
                  <div key={course.id}>
                    <p>{course.id} — {course.courseName}</p>
                    <p>Grade: {course.grade || "—"}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Account;
