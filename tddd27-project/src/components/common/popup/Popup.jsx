import Autocomplete from "../autocomplete/Autocomplete";
import "./Popup.css";
import { useState } from "react";
import { createRoot } from "react-dom/client";

function Popup() {
    const [courseRated, drawCircle] = useState(false);
    const toggleCircle = () => {
        drawCircle(!courseRated);
        console.log("Du försökte rate:a");
    };

    return (
        <div className="page_popup">
            <div className="container_popup">
                <div className="top_of_post_it">
                    <p className="popup_course_code">TNG032</p>
                </div>
                <p className="popup_course_name">Applied Transform Theory</p>
                <div className="examinator_and_department">
                    <p className="popup_examinator">Examinator: Lukás Malý</p>
                    <p className="popup_department">Department: ITN</p>
                </div>
                <div className="popup_grade_container">
                    <p className="popup_grade">Grade: </p>
                    <p className="popup_grade_variable">3</p>
                </div>
                <p className="text_before_rating"> My rating of the course:</p>
                <div className="popup_rate_course">
                    {/* byt ut mot komponenter */}
                    <p
                        className="popup_rate_2"
                        onClick={toggleCircle}
                        isOpen={courseRated}
                    >
                        1
                    </p>
                    <p className="popup_rate_2">2</p>
                    <p className="popup_rate_2">3</p>
                    <p className="popup_rate_2">4</p>
                    <p className="popup_rate_2">5</p>
                </div>

                <p className="rate_course_rating_selected">O</p>
            </div>
        </div>
    );
}

export default Popup;
