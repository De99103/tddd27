import {
  doc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
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
  { merge: true }
);
  return await setDoc(
    doc(
      db,
      "users",
      user.uid,
      "educations",
      educationId,
      collectionName,
      courseId
    ),
    {
      grade: data.grade || "",
      notes: data.notes || "",
      rating: data.rating || "",
      updatedAt: serverTimestamp(),
    },
    { merge: true }
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
