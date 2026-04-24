import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export async function saveProgram(programCode) {
    const user = auth.currentUser;

    if (!user) {
        console.log("No user logged in");
        return;
    }

    try {
        await setDoc(
            doc(db, "users", user.uid),
            {
                selectedProgram: programCode,
            },
            { merge: true }
        );

        console.log("Program saved:", programCode);
        console.log("Saved for user:", user.uid);
    } catch (error) {
        console.error("Could not save program:", error);
    }
}