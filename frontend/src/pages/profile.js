import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Home from "@mui/icons-material/Home";
import { Typography } from '@mui/material';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';
import Tooltip from '@mui/material/Tooltip';
import { baseURL } from "../base";

const Profile = () => {
    const { user } = useAuthContext();
    const { logout } = useLogout();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [emailReset, setEmailReset] = useState(true);
    const [usernameReset, setUsernameReset] = useState(true);

    const navigate = useNavigate();

    const handleHomeClick = () => {
        navigate("/");
    };

    const handleResetEmail = () => {
        setEmailReset(true);
        setEmail(user.email);
    };

    const handleResetUsername = () => {
        setUsernameReset(true);
        setUsername(user.username);
    };

    const handleLogout = () => {
        logout();
    };

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        var newUsername = username;
        if (newUsername === user.username) {
            newUsername = null;
        }
        var newEmail = email;
        if (newEmail === user.email) {
            newEmail = null;
        }
        axios
          .put(`${baseURL}/api/user/update`, { email: user.email, newEmail, newUsername })
          .then(async (res) => {
            if (res.data.Status === "Success") {
              setError("Details Updated. Please Login Again!");
              await sleep(750);
              logout();
            } else {
              setError(res.data.error);
            }
          })
          .catch((err) => console.log(err))
          .finally(() => setIsLoading(false));
    };

    return (
        <div>
            <header>
                <Tooltip title="Home">
                    <IconButton onClick={handleHomeClick} className="home-both">
                        <Home fontSize="large" className="icon-color"/>
                    </IconButton>
                </Tooltip>
            </header>
            <form className="login" onSubmit={handleUpdate}>
                <h3 className="h3-profile">
                    User Profile
                </h3>
                <span className="profilereset">
                    <label>Username:</label>
                    <button type="button" onClick={handleResetUsername} disabled={isLoading}>Reset</button>
                </span>
                <input
                    type="username"
                    placeholder="Enter new username"
                    autoComplete="off"
                    onChange={(e) => {
                        setUsername(e.target.value);
                        setUsernameReset(false);
                    }}
                    value={usernameReset ? user.username : username}
                    name={usernameReset ? user.username : username}
                />

                <span className="profilereset">
                    <label>Email:</label>
                    <button type="button" onClick={handleResetEmail} disabled={isLoading}>Reset</button>
                </span>
                <input
                    type="email"
                    placeholder="Enter new email"
                    autoComplete="off"
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailReset(false);
                    }}
                    value={emailReset ? user.email : email}
                    name={emailReset ? user.email : email}
                />
                <button type="submit" disabled={isLoading}>{isLoading ? "Loading..." : "Update Details"}</button>
                <Typography className="add-top-margin">Want to reset your password?<Link to='/forgotpassword' className="link"> Reset it here!</Link></Typography>
                <button type="button" onClick={handleLogout} disabled={isLoading} className="logout">Log Out</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default Profile;
