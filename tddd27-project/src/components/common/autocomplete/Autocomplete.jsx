import MuiAutocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import "./Autocomplete.css";

const options = [
    "Civilingenjörsprogram i medieteknik",
    "Civilingenjörsprogram i medieteknik och AI",
    "Civilingenjörsprogram i informationsteknologi (IT)",
    "Civilingenjörsprogram i datateknik",
    "Civilingenjörsprogram i mjukvaruteknik",
    "Civilingenjörsprogram i medicinsk teknik",
    "Civilingenjörsprogram i elektronik och systemdesign"

];

const Autocomplete = ({ onCoursesLoaded }) => {
    const handleChange = async (event, value) => {
        let filePath = "";

        if (value === "Civilingenjörsprogram i medieteknik och AI") {
            filePath = "/src/assets/data/MT-AI.json";
        } else if (value === "Civilingenjörsprogram i medieteknik") {
            filePath = "/src/assets/data/MT.json";
        }
        else if (value === "Civilingenjörsprogram i informationsteknologi (IT)") {
            filePath = "/src/assets/data/IT_courses.json";
        } else if (value === "Civilingenjörsprogram i datateknik") {
            filePath = "/src/assets/data/DT_courses.json";
        } else if (value === "Civilingenjörsprogram i mjukvaruteknik") {
            filePath = "/src/assets/data/MK_courses.json";
        } else if (value === "Civilingenjörsprogram i medicinsk teknik") {
            filePath = "/src/assets/data/MedTech_courses.json";
        }
        else if (value === "Civilingenjörsprogram i elektronik och systemdesign") {
            filePath = "/src/assets/data/ED_courses.json";
        }

        if (!filePath) return;

        try {
            const response = await fetch(filePath);
            const data = await response.json();

            onCoursesLoaded(data.courses);
        } catch (error) {
            console.error("Could not load courses:", error);
            onCoursesLoaded([]);
        }
    };

    return (
        <div className="autocomplete-wrapper">
            <MuiAutocomplete
                options={options}
                autoComplete
                autoHighlight
                onChange={handleChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search.."
                        sx={{
                            "& .MuiInputLabel-root": {
                                fontSize: "15px",
                            },
                        }}
                    />
                )}
            />
        </div>
    );
};

export default Autocomplete;