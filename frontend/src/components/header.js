import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Search from "./search";
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { useNavigate, useLocation } from "react-router-dom";
import "../homeStyles.css";
import React from "react";
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Tooltip from '@mui/material/Tooltip';

function Header({ search, setSearch }) {
    const navigate = useNavigate();
    const location = useLocation(); // Get current path

    const homeNav = () => {
        navigate("/");
    };

    const libraryNav = () => {
        navigate("/library");
    };

    const handleProfileClick = () => {
        navigate("/profile");
    };

    return (
        <div className="header_container">
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                    m: 2,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: "row",
                        alignItems: "center",
                        m: 2,
                    }}
                >
                    <header>
                        <Tooltip title="My Account">
                            <IconButton onClick={handleProfileClick}>
                                <AccountCircleIcon fontSize="large" className="icon-color" />
                            </IconButton>
                        </Tooltip>
                    </header>
                    <button
                        type="button"
                        onClick={homeNav}
                        className={`mainButtons ${location.pathname === "/" ? "activeButton" : ""}`}
                        id="homeBtn"
                    >
                        Home
                    </button>
                    <button
                        type="button"
                        onClick={libraryNav}
                        className={`mainButtons ${location.pathname === "/library" ? "activeButton" : ""}`}
                    >
                        Library
                    </button>
                </Box>
                <Search searchString={search} setSearchString={setSearch} />
                <Stack direction="row" spacing={2}>
                    <p>Moodify</p>
                    <MusicNoteIcon />
                </Stack>
            </Box>
        </div>
    );
}

export default Header;
