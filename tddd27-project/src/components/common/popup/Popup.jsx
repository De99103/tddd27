import Autocomplete from "../autocomplete/Autocomplete";
import RateButton from "../rateButton";
import "./Popup.css";

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
                </div>
            </div>
        </div>
    );
}

export default Popup;
