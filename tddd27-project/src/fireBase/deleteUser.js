import {  deleteUser, GoogleAuthProvider, reauthenticateWithPopup, } from "firebase/auth";

import {
  collection,
  doc,
  getDocs,
  writeBatch,
} from "firebase/firestore";

import { auth, db } from "./firebase";

export async function deleteAccount() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No user is logged in.");
  }

  const userId = user.uid;

  const provider = new GoogleAuthProvider();
  await reauthenticateWithPopup(user, provider);

  const batch = writeBatch(db);

  const educationsRef = collection(db, "users", userId, "educations");
  const educationsSnapshot = await getDocs(educationsRef);

  for (const educationDoc of educationsSnapshot.docs) {
    const educationId = educationDoc.id;

    const mandatoryCoursesRef = collection(
      db,
      "users",
      userId,
      "educations",
      educationId,
      "mandatoryCourses"
    );

    const selectedCoursesRef = collection(
      db,
      "users",
      userId,
      "educations",
      educationId,
      "selectedCourses"
    );

    const mandatoryCoursesSnapshot = await getDocs(mandatoryCoursesRef);
    const selectedCoursesSnapshot = await getDocs(selectedCoursesRef);

    mandatoryCoursesSnapshot.docs.forEach((courseDoc) => {
      batch.delete(courseDoc.ref);
    });

    selectedCoursesSnapshot.docs.forEach((courseDoc) => {
      batch.delete(courseDoc.ref);
    });

    batch.delete(educationDoc.ref);
  }

  batch.delete(doc(db, "users", userId));

  await batch.commit();

  await deleteUser(user);
}