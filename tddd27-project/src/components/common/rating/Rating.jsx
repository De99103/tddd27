import "./rating.css";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { db } from "../../../firebase/firebase";
import { auth } from "../../../firebase/firebase";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";


function Rating({ courseId = null }) {
    const [rating, setRating] = useState("");

    async function onvaluechange(value) {
        console.log("onvaluechange called, courseId:", courseId); // ← first line

        setRating(value);
        if (!courseId) {
            console.warn("Rating: no courseId provided, skipping save");
            return;
        }

        if (!auth.currentUser) {
            console.warn("Rating: user not logged in, skipping save");
            return;
        }

        try {
            // debugg : 
            console.log("auth.currentUser:", auth.currentUser);
            console.log("writing to path:", `courseStats/${courseId}/ratings`);
            // Det nya sättet att skriva i Firebase 
            await addDoc(collection(db, "courseStats", courseId, "ratings"), {
                rating: value,
                createdAt: new Date(),
            });
            console.log("Rating saved!", value);
        } catch (error) {
            console.error("Error saving to Firebase:", error);
        }

    }

    return (
        <div className="rating_container">
            <ToggleGroup.Root className="ToggleGroup" type="single" value={rating} onValueChange={onvaluechange}>
                <ToggleGroup.Item className="ToggleGroupItem" value="1">
                    1
                </ToggleGroup.Item>
                <ToggleGroup.Item className="ToggleGroupItem" value="2">
                    2
                </ToggleGroup.Item>
                <ToggleGroup.Item className="ToggleGroupItem" value="3">
                    3
                </ToggleGroup.Item>
                <ToggleGroup.Item className="ToggleGroupItem" value="4">
                    4
                </ToggleGroup.Item>
                <ToggleGroup.Item className="ToggleGroupItem" value="5">
                    5
                </ToggleGroup.Item>
            </ToggleGroup.Root>
        </div>
    );
}

export default Rating;
