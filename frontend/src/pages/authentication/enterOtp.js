import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { baseURL } from "../../base";
import { useAuthContext } from '../../hooks/useAuthContext';
import Tooltip from '@mui/material/Tooltip';
import IconButton from "@mui/material/IconButton";
import Home from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const EnterOtp = () => {
  const { user } = useAuthContext();
  const [enteredOTP, setEnteredOTP] = useState("");
  const [error, setError] = useState(null);
  const [accessError, setAccessError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();
  const [originalOTP, setOriginalOTP] = useState("");
  const [email, setEmail] = useState("");
  useEffect(() => {
    try {
      setEmail(location.state.email);
      setOriginalOTP(location.state.otp);
      setAccessError(null);
    } catch (error) {
      setAccessError("Cannot Access Page");
    }
  }, [location.state]);

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOtpSent(false);
    if (Number(originalOTP) === Number(enteredOTP)) {
      setError(null);
      navigate("/resetPassword", {state: { email: email }});
    } else {
      setError("Incorrect OTP entered.")
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    axios
      .post(`${baseURL}/api/user/forgot`, { email })
      .then((res) => {
        if (res.data.Status === "Success") {
          navigate("/enterOtp", {state: {otp: res.data.OTP, email: email}});
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
        setOtpSent(true);
      });
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
            <form className="login" onSubmit={handleSubmit} onReset={handleReset}>
              <h3>
                Enter the OTP sent to your email:
              </h3>
              <label>OTP: </label>
              <input
                type="text"
                placeholder="Enter OTP"
                autoComplete="off"
                onChange={(e) => setEnteredOTP(e.target.value)}
                value={enteredOTP}
                name={enteredOTP}
              />
              <button type="submit">Submit</button>
              <button type="reset" className="margin-left" disabled={isLoading}>{isLoading ? "Sending..." : "Resend"}</button>
              <button type="button" onClick={handleProfileClick} className="send-to-right" disabled={isLoading}>Cancel</button>
              {error && <p className="error">{error}</p>}
              {otpSent && <p className="error">OTP Sent!</p>}
            </form>
          </div>
        )}
    </div>
  );
};

export default EnterOtp; 