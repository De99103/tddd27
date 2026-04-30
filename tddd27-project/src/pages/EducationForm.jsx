import { useState } from "react";
import { addDoc } from "firebase/firestore"; // should add collection too
import { db } from "../fireBase/firebase";


// name på utbildning ,beytyg på kursena . masterkuser som valt eller profil . egena anteckningar. 

function EducationForm() {
    //what to save : 
    const [educationName, setEducationName] = useState("");
    const [courseName, setCourseName] = useState("");
    const [grade, setGrade] = useState("");
    const [masterCourse, setMasterCourse] = useState("");
    const [profile, setProfile] = useState("");
    const [notes, setNotes] = useState("");
    // a const for the statistics of the couses. or should be more speicif for evert couse ?? 
    const [statistics, setStatistics] = useState({});


    async function handleSave(event) {
        try {
            await addDoc(collection(db, "educations"), {
                educationName,
                courseName,
                grade,
                masterCourse,
                profile,
                notes,
                createdAt: new Date() // Timestamp for when the document is created 
            });

            alert("Education saved!");
        }

        catch (error) {
            console.error("Error saving education: ", error);
            alert("Failed to save education. Please try again.");


        }
    }

    return (
        <div>
             <input
        placeholder="Name på utbildning"
        value={educationName}
        onChange={(e) => setEducationName(e.target.value)}
      />
        </div>
    ); 

}
export default EducationForm;
