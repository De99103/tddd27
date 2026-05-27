import {
  doc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
  getDoc,
  deleteDoc
} from "firebase/firestore";

import { auth, db } from "./firebase";
import { deleteUser } from "firebase/auth";

export async function saveCourse(educationId, courseType, courseId, data) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not logged in.");
  }

  // creates the education document
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
      // notes: data.notes || "",
      // rating: data.rating || "",
      ...data, // will save all fileds we send from course.jsx 
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


export async function getCourse(educationId, courseType, courseId) {
  const user = auth.currentUser;
  if (!user) throw new Error("User is not logged in.");

  const collectionName =
    courseType === "mandatory" ? "mandatoryCourses" : "selectedCourses";

  const ref = doc(db, "users", user.uid, "educations", educationId, collectionName, courseId);
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
    sharedWith: arrayUnion(user.uid), //  adds without duplicates
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

// to get the public profile of the user, if the profile is not public return null
export async function getPublicProfile(userId) {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    console.log("User does not exist");
    return null;
  }

  const data = userSnap.data();

  console.log("user data:", data);

  return {
    displayName: data.displayName || data.name || "",
    educations: await getPublicEducations(userId),
  };
}


  

// to get the educations of the user, and for each education get the mandatory and selected courses
export async function getPublicEducations(userId) {
  const educationsRef = collection(db, "users", userId, "educations");
  const educationsSnap = await getDocs(educationsRef);

  const educations = await Promise.all(
    educationsSnap.docs.map(async (educationDoc) => {
      const educationId = educationDoc.id;
      const educationData = educationDoc.data();

      const mandatoryCoursesSnap = await getDocs(
        collection(
          db,
          "users",
          userId,
          "educations",
          educationId,
          "mandatoryCourses"
        )
      );

      const selectedCoursesSnap = await getDocs(
        collection(
          db,
          "users",
          userId,
          "educations",
          educationId,
          "selectedCourses"
        )
      );

      return {
        id: educationId,
        ...educationData,
        mandatoryCourses: mandatoryCoursesSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
        selectedCourses: selectedCoursesSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      };
    })
  );

  return educations;
}
