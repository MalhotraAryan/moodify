import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../base";
import { useAuthContext } from '../../hooks/useAuthContext';
import Tooltip from '@mui/material/Tooltip';
import IconButton from "@mui/material/IconButton";
import Home from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const ForgotPassword = () => {
  const { user } = useAuthContext();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .post(`${baseURL}/api/user/forgot`, { email })
      .then((res) => {
        if (res.data.Status === "Success") {
          setError(null);
          navigate("/enterOtp", {state: {otp: res.data.OTP, email: email}});
        } else {
          setError(res.data.error);
          setEmail("");
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  return (
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
            Forgot your Password? Reset it here!
          </h3>
          <label>Email: </label>
          <input
            type="email"
            placeholder="Enter Email"
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            name={email}
          />
          <button type="submit" disabled={isLoading}>{isLoading ? "Loading..." : "Reset Password"}</button>
          <button type="button" onClick={handleProfileClick} className="send-to-right" disabled={isLoading}>Cancel</button>
          {error && <p className="error">{error}</p>}
        </form>
    </div>
  );
};

export default ForgotPassword;
