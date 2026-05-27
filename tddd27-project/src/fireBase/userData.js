import {
  doc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc, arrayUnion, arrayRemove, 
  query, where
} from "firebase/firestore";

import { auth, db } from "./firebase";
import { deleteUser } from "firebase/auth";

import mtData from "../assets/data/MT_courses.json";
import dtData from "../assets/data/DT.json";
import edData from "../assets/data/ED.json";
import itData from "../assets/data/IT_courses_fixed.json";

// helper to find course info across all programs
function findCourseInfo(courseCode) {
    const allCourses = [
        ...mtData.courses,
        ...dtData.courses,
        ...edData.courses,
        ...itData.courses,
    ];
    return allCourses.find(c => c.course_code.toLowerCase() === courseCode.toLowerCase());
}

export async function saveCourse(educationId, courseType, courseId, data) {
  const user = auth.currentUser;
  if (!user) throw new Error("User is not logged in.");

  const collectionName = courseType === "mandatory" ? "mandatoryCourses" : "selectedCourses";

  // creates the education document
  await setDoc(
    doc(db, "users", user.uid, "educations", educationId),
    {
      programName: educationId,
      isPublic: false,
      createdAt: serverTimestamp()
    },
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
    return snapshot.docs.map(d => ({ id: d.id, name: d.data().displayName }));
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

export async function addCollaborator(ownerId, collaboratorUid) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in");

  await updateDoc(doc(db, "users", ownerId), {
    sharedWith: arrayUnion(collaboratorUid), //  adds without duplicates
  });
}

export async function removeCollaborator(ownerId, collaboratorUid) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in");

  await updateDoc(doc(db, "users", ownerId), {
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


// Visitor proposes a change
export async function requestCourseChange(ownerId, requestData) {
  const ref = collection(db, "users", ownerId, "changeRequests");
  await addDoc(ref, {
    ...requestData,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}

// Owner responds
export async function respondToChangeRequest(ownerId, requestId, accept, requestData) {
  const requestRef = doc(db, "users", ownerId, "changeRequests", requestId);

  if (accept) {
    console.log("Attempting to", requestData.action, "course:");
    console.log("path: users/", ownerId, "/educations/", requestData.educationId, "/selectedCourses/", requestData.courseId);

    const courseRef = doc(
      db, "users", ownerId, "educations",
      requestData.educationId, "selectedCourses", requestData.courseId
    );

    if (requestData.action === "add") {
      const courseInfo = findCourseInfo(requestData.courseId);

      await setDoc(courseRef, {
        courseName: courseInfo?.course_name || requestData.courseName,
        credits_hp: courseInfo?.credits_hp || "",
        year: courseInfo?.year || "",
        semester: courseInfo?.semester || "",
        period: courseInfo?.period || "",
        grade: "",
        updatedAt: serverTimestamp(),
      });
    } else if (requestData.action === "remove") {
      await deleteDoc(courseRef);
    }

    await sendNotification(requestData.requestedBy,
      `Your request to ${requestData.action} "${requestData.courseName}" was accepted!`
    );
  } else {
    await sendNotification(requestData.requestedBy,
      `Your request to ${requestData.action} "${requestData.courseName}" was rejected.`
    );
  }

  await deleteDoc(requestRef);
}