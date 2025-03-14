import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { baseURL } from "../base";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const signup = async (username, email, password) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(`${baseURL}/api/user/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
      // the data has to be sent to the web server in the form of string
      // so JSON.stringify convert JSON objects into strings
    });

    const json = await response.json(); // js object
    // returns information with json web token if it was a success or error message

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }
    // console.log("hi");
    if (response.ok) {
      // save the user to localstorage
      // console.log(JSON.stringify(json));
      localStorage.setItem("user", JSON.stringify(json));

      // update the auth context
      dispatch({ type: "LOGIN", payload: json });

      setIsLoading(false);
    }
  };
  return { signup, isLoading, error };
};
