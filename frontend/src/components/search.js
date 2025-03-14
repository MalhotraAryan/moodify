import React from "react";
import TextField from "@mui/material/TextField";

function Search({searchString, setSearchString}) {
    const updateSearch = (evt) => {
        setSearchString(evt.target.value);
    }
    return (
        <TextField
            sx={{
                width: "400px", 
                backgroundColor: "rgba(200, 200, 200, 0.5)", 
                borderRadius: "50px",
                "& .MuiOutlinedInput-root": {
                    border: "none",
                    "& fieldset": {
                        border: "none",
                    },
                    "&:hover fieldset": {
                        border: "none",
                    },
                    "&.Mui-focused fieldset": {
                        border: "none",
                    },
                },
            }}
            placeholder="Search for songs, artists, or albums..."
            value={searchString}
            onChange={updateSearch}
        />
    );
}

export default Search
