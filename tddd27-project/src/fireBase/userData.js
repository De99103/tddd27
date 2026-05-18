import {
    doc,
    setDoc,
    collection,
    addDoc,
    serverTimestamp,
    getDoc,
    getDocs,
    deleteDoc,
} from "firebase/firestore";

import { auth, db } from "./firebase";
import { deleteUser } from "firebase/auth";

export async function saveCourse(educationId, courseType, courseId, data) {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("User is not logged in.");
    }

    const collectionName =
        courseType === "mandatory" ? "mandatoryCourses" : "selectedCourses";
    await setDoc(
        doc(db, "users", user.uid),
        {
            displayName: user.displayName || "",
            email: user.email || "",
            updatedAt: serverTimestamp(),
        },
        { merge: true },
    );
    return await setDoc(
        doc(
            db,
            "users",
            user.uid,
            "educations",
            educationId,
            collectionName,
            courseId,
        ),
        {
            grade: data.grade || "",
            // notes: data.notes || "",
            // rating: data.rating || "",
            ...data, // will save all fileds we send from course.jsx
            updatedAt: serverTimestamp(),
        },
        { merge: true },
    );
}

export async function savePublicCourseRating(courseId, data) {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("User is not logged in.");
    }

    return await addDoc(collection(db, "courseStats", courseId, "ratings"), {
        rating: data.rating,
        grade: data.grade || "",
        createdAt: serverTimestamp(),
    });
}

export async function deleteAccount() {
    const user = auth.currentUser;

    if (!user) throw new Error("No user");

    await deleteDoc(doc(db, "users", user.uid));
    await deleteUser(user);
}

export async function getCourse(educationId, courseType, courseId) {
    const user = auth.currentUser;
    if (!user) throw new Error("User is not logged in.");

    const collectionName =
        courseType === "mandatory" ? "mandatoryCourses" : "selectedCourses";

    const ref = doc(
        db,
        "users",
        user.uid,
        "educations",
        educationId,
        collectionName,
        courseId,
    );
    const snapshot = await getDoc(ref);

    if (snapshot.exists()) {
        return snapshot.data();
    }
    return null;
}

// to get all name's options:
export async function getDisplayNameOptions() {
    const snapshot = await getDocs(collection(db, "users"));

    return snapshot.docs.map((userDoc) => ({
        id: userDoc.id,
        name: userDoc.data().displayName || "Unnamed user",
    }));
}

// our goal : user.displayName
export async function getName(userId) {
    const user = auth.currentUser;
    if (!user) throw new Error("User is not logged in.");

    const ref = doc(db, "users", userId);
    const snapshot = await getDoc(ref);

    if (snapshot.exists()) {
        return snapshot.data();
    } else {
        snapshot.data().displayName || "";
    }
    return null;
}

//   if (!snapshot.exists()) { return null;

//   return snapshot.data().displayName || "";
// }
