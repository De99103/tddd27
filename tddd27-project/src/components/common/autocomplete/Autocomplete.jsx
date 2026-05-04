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
                forcePopupIcon={false}
                openOnFocus
                autoComplete
                autoHighlight
                onChange={(event, newValue) => onChange?.(newValue)}
                getOptionLabel={getOptionLabel}
                isOptionEqualToValue={(option, value) => {
                    if (!option || !value) return false;

                    if (
                        typeof option === "string" ||
                        typeof value === "string"
                    ) {
                        return option === value;
                    }

                    if (option.id && value.id) {
                        return option.id === value.id;
                    }

                    if (option.name && value.name) {
                        return option.name === value.name;
                    }

                    if (option.filePath && value.filePath) {
                        return option.filePath === value.filePath;
                    }

                    if (option.course_code && value.course_code) {
                        return option.course_code === value.course_code;
                    }

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
