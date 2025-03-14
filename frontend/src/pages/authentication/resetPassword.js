import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { baseURL } from "../../base";
import { useAuthContext } from '../../hooks/useAuthContext';
import Tooltip from '@mui/material/Tooltip';
import IconButton from "@mui/material/IconButton";
import Home from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const ResetPassword = () => {
  const { user } = useAuthContext();
  const [newPasswordOne, setNewPasswordOne] = useState("");
  const [newPasswordTwo, setNewPasswordTwo] = useState("");
  const [accessError, setAccessError] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  useEffect(() => {
      try {
        setEmail(location.state.email);
        setAccessError(null);
      } catch (error) {
        setAccessError("Cannot Access Page");
      }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    if (newPasswordOne !== newPasswordTwo) {
        setError("Passwords don't match. Please try again.")
        setIsLoading(false);
        return;
    }
    axios
      .post(`${baseURL}/api/user/reset`, { email, newPasswordOne })
      .then((res) => {
        if (res.data.Status === "Success") {
          navigate("/login");
        } else {
            setError(res.data.error);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <div>
        {accessError ? (<p className="center-text">{accessError}</p>) : (
            <div>
                {user ? <header>
                            <Tooltip title="Home">
                                <IconButton onClick={handleHomeClick} className="home-both">
                                    <Home fontSize="large" className="icon-color"/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="My Account">
                                <IconButton onClick={handleProfileClick} className="acc-both">
                                    <AccountCircleIcon fontSize="large" className="icon-color"/>
                                </IconButton>
                            </Tooltip>
                        </header> : null}
                <form className="login" onSubmit={handleSubmit}>
                    <h3>
                        Reset Password:
                    </h3>
                    <label>New Password: </label>
                    <input
                        type="password"
                        placeholder="Enter new password"
                        autoComplete="off"
                        onChange={(e) => setNewPasswordOne(e.target.value)}
                        value={newPasswordOne}
                        name={newPasswordOne}
                    />
                    <input
                        type="password"
                        placeholder="Enter new password again"
                        autoComplete="off"
                        onChange={(e) => setNewPasswordTwo(e.target.value)}
                        value={newPasswordTwo}
                        name={newPasswordTwo}
                    />
                    <button type="submit" disabled={isLoading}>{isLoading ? "Loading..." : "Submit"}</button>
                    <button type="button" onClick={handleProfileClick} className="send-to-right" disabled={isLoading}>Cancel</button>
                    {error && <p className="error">{error}</p>}
                </form>
            </div>
        )
        }
    </div>
  );
};

export default ResetPassword; 