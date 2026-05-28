import { useState } from "react";
import {
    requestCourseChange,
    sendNotification,
} from "../../../fireBase/userData";
import "../otherProfile/otherProfile.css";

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
            courseId: courseId.trim().toUpperCase(),
            courseName: courseId.trim().toUpperCase(),
        });
        await sendNotification(
            ownerId,
            `${requestedBy.displayName} wants to add "${courseId.toUpperCase()}" to your selected courses`,
        );
        setSent(true);
        setCourseId(""); // clear input

        // reset after 3 seconds so they can propose another
        setTimeout(() => setSent(false), 3000);
    }

    if (sent) return <p className="adding_proposal_sent">✅ Proposal sent</p>;

    return (
        <div>
            <input
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                placeholder="Course ID to add"
            />
            <button className="adding_proposal" onClick={handlePropose}>
                + Propose add
            </button>
        </div>
    );
}

export default ProposeAddCourse;
