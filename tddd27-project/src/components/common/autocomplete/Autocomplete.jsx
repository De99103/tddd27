import MuiAutocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import "./Autocomplete.css";

const Autocomplete = ({
    options = [],
    value = null,
    onChange,
    label = "Search..",
    className = "",
    getOptionLabel = (option) =>
        typeof option === "string" ? option : option?.name || "",
}) => {
    return (
        <div className={`autocomplete-wrapper ${className}`}>
            <MuiAutocomplete
                options={Array.isArray(options) ? options : []}
                value={value}
                onChange={(event, newValue) => onChange?.(newValue)}
                autoComplete
                autoHighlight
                getOptionLabel={getOptionLabel}
                isOptionEqualToValue={(option, value) => {
                    if (!option || !value) return false;

                    if (option.filePath && value.filePath) {
                        return option.filePath === value.filePath;
                    }

                    if (option.course_code && value.course_code) {
                        return option.course_code === value.course_code;
                    }

                    return false;
                }}
                renderInput={(params) => (
                    <TextField {...params} label={label} variant="outlined" />
                )}
            />
        </div>
    );
};

export default Autocomplete;