import "./rating.css";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { db } from "../../../firebase/firebase";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";


function Rating() {
    const [rating, setRating] = useState("0");

    async function onvaluechange(value) {
       try {
            // Det nya sättet att skriva i Firebase v9+
            await addDoc(collection(db, "ratings"), {
                Rating: value,
                timestamp: new Date() // Bra att ha för att sortera senare!
            });
            console.log("Saved in Firebase! WHoo!!! Value:", value);
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
