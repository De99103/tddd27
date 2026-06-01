import MuiAutocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import "./Autocomplete.css";

// Reusable autocomplete wrapper around MUI's Autocomplete.
// Used across the app for programs, courses, specialisations, and user search.
const Autocomplete = ({
    options = [],
    value = null,
    onChange,
    label = "Search..",
    className = "",
    // Default label extractor — works for plain strings or objects with a name field.
    getOptionLabel = (option) =>
        typeof option === "string" ? option : option?.name || "",
}) => {
    return (
        <div className={`autocomplete-wrapper ${className}`}>
            <MuiAutocomplete
                options={Array.isArray(options) ? options : []}
                value={value}
                forcePopupIcon={false}
                openOnFocus
                autoComplete
                autoHighlight
                onChange={(event, newValue) => onChange?.(newValue)}
                getOptionLabel={getOptionLabel}
                
                // Unique key per option to avoid React duplicate key warnings.
                // Courses can appear in multiple semesters AND specialisations,
                // so we combine course_code + semester + specialisation to guarantee uniqueness.
                getOptionKey={(option) =>
                    typeof option === "string"
                        ? option
                        : `${option?.course_code || option?.id || option?.name}-${option?.semester ?? ""}-${option?.specialisation ?? ""}`
                }

                // Determines if an option matches the current value.
                // Tries multiple fields in order: id, name, filePath, course_code.
                isOptionEqualToValue={(option, value) => {
                    if (!option || !value) return false;
                    if (typeof option === "string" || typeof value === "string") {
                        return option === value;
                    }
                    if (option.id && value.id) return option.id === value.id;
                    if (option.name && value.name) return option.name === value.name;
                    if (option.filePath && value.filePath) return option.filePath === value.filePath;
                    if (option.course_code && value.course_code) return option.course_code === value.course_code;
                    return option === value;
                }}

                renderInput={(params) => (
                    <TextField {...params} label={label} variant="outlined" />
                )}
            />
        </div>
    );
};

export default Autocomplete;