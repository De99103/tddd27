import {
  doc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc, arrayUnion,arrayRemove
} from "firebase/firestore";

import { auth, db } from "./firebase";
import { deleteUser } from "firebase/auth";

export async function saveCourse(educationId, courseType, courseId, data) {
  const user = auth.currentUser;
  if (!user) throw new Error("User is not logged in.");

  const collectionName = courseType === "mandatory" ? "mandatoryCourses" : "selectedCourses";

  // ✅ ADD THIS — creates the education document
  await setDoc(
    doc(db, "users", user.uid, "educations", educationId),
    { programName: educationId,
      isPublic: false,  
      createdAt: serverTimestamp() },
    { merge: true }
  );

  // existing user doc update
  await setDoc(doc(db, "users", user.uid), {
    displayName: user.displayName || "",
    email: user.email || "",
    updatedAt: serverTimestamp(),
  }, { merge: true });

  // existing course save
  return await setDoc(
    doc(db, "users", user.uid, "educations", educationId, collectionName, courseId),
    {
      ...data,
      ecv: data.ecv ?? "",
      year: data.year ?? "",
      semester: data.semester ?? "",
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function updateProfileVisibility(isPublic) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in");

  await updateDoc(doc(db, "users", user.uid), {
    isPublic: isPublic,
  });
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

  if (!snapshot.exists()) return null;

  return snapshot.data().displayName || "";
}

export async function addCollaborator(targetUserId) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in");

  await updateDoc(doc(db, "users", targetUserId), {
    sharedWith: arrayUnion(user.uid), // ✅ adds without duplicates
  });
}

export async function removeCollaborator(targetUserId, collaboratorUid) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in");

  await updateDoc(doc(db, "users", targetUserId), {
    sharedWith: arrayRemove(collaboratorUid),
  });
}

export async function sendNotification(toUid, message) {
  await addDoc(collection(db, "users", toUid, "notifications"), {
    message: message,
    read: false,
    createdAt: serverTimestamp(),
  });
}