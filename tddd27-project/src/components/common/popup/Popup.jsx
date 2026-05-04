import Autocomplete from "../autocomplete/Autocomplete";
import RateButton from "../rateButton";
import "./Popup.css";
import { useState } from "react";


const [courseRating, setCourseRating] = useState(0);

function Popup() {
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

                <div className="popup_rate_course_buttons">
                    <RateButton number={"1"} />
                    <RateButton number={"2"} />
                    <RateButton number={"3"} />
                    <RateButton number={"4"} />
                    <RateButton number={"5"} />
                </div>
                
                 <div className="textAndInput">
                        <p>
                            Rating/<i>Rating 1-5:</i>
                        </p>

                        <select
                            value={courseRating}
                            onChange={(e) =>
                                setCourseRating(Number(e.target.value))
                            }
                        >
                            <option value="">Select rating</option>
                            <option value="1">1 - Very easy</option>
                            <option value="2">2 - Easy</option>
                            <option value="3">3 - Medium</option>
                            <option value="4">4 - Hard</option>
                            <option value="5">5 - Very hard</option>
                        </select>
                    </div>
                    
                
            </div>
        </div>
    );
}

export default Popup;
