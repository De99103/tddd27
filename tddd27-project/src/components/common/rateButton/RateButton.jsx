import { useState } from "react";
import "./RateButton.css";

function RateButton({ number }) {
    const [ratingSelected, setRatingSelected] = useState(false);

    const toggleSelectedRating = () => {
        setRatingSelected(!ratingSelected);
        console.log(`${ratingSelected} är det`);
    };

    return (
        <div className="page_rate_course_buttons">
            <button
                id="4"
                onClick={toggleSelectedRating}
            >
                {number}
            </button>
            <p className="selectionSymbol">O</p>

            <style>{`
            
                .selectionSymbol {
                    opacity: ${ratingSelected ? 1 : 0};
                }

            
            `}</style>
        </div>
    );
}

export default RateButton;
