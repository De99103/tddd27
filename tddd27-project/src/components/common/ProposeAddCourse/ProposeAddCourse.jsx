import { useState } from "react";
import { requestCourseChange, sendNotification } from "../../../fireBase/userData";


function ProposeAddCourse({ educationId, ownerId, requestedBy }) {
  const [courseId, setCourseId] = useState("");
  const [sent, setSent] = useState(false);

  async function handlePropose() {
    if (!courseId.trim()) return;
    await requestCourseChange(ownerId, {
      requestedBy: requestedBy.uid,
      requestedByName: requestedBy.displayName,
      educationId,
      action: "add",
      courseId: courseId.trim().toUpperCase(), // ← always uppercase
      courseName: courseId.trim(),
    });
    await sendNotification(ownerId,
      `${requestedBy.displayName} wants to add "${courseId}" to your selected courses`
    );
    setSent(true);
  }

  if (sent) return <p>✅ Proposal sent</p>;

  return (
    <div>
      <input
        value={courseId}
        onChange={e => setCourseId(e.target.value)}
        placeholder="Course ID to add"
      />
      <button onClick={handlePropose}>+ Propose add</button>
    </div>
  );
}

export default ProposeAddCourse;
