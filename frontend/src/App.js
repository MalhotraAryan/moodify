import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/authentication/login';
import Signup from './pages/authentication/signup';
import ForgotPassword from './pages/authentication/forgotPassword';
import EnterOtp from './pages/authentication/enterOtp';
import ResetPassword from './pages/authentication/resetPassword';
import Profile from './pages/profile';
import { useAuthContext } from './hooks/useAuthContext';
import ListView from './pages/list_view';
import { useState, useEffect } from 'react';
import { baseURL } from './base';
import axios from 'axios';
import SongPlayer from "./components/songPlayer";



function App({ allSongs }) {
  const { user } = useAuthContext();

  const [userLibrary, setUserLibrary] = useState({"Energetic":[],"Peaceful":[],"Happy":[],"Sad":[],"Groovy":[],"Romantic":[],"Dark":[],"World":[],"Workout":[],"Misc":[]})

  useEffect(() => {
    const fetchUserLibrary = async () => {
      if (user && user.username) {
        try {
          const res = await axios.get(baseURL + '/api/user/' + user.username);
          console.log(res);

          if (res.data.message === "OK") {
            setUserLibrary(res.data.data);
            console.log(res.data.data);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchUserLibrary();
  }, [user]);  // Depend on 'user' to trigger the effect when it changes

  const routes = [
    { 
      path: '/', 
      element: user ? 
      <Home 
        allSongs={allSongs} 
        userLibrary={userLibrary} 
        setUserLibrary={setUserLibrary} 
      /> 
      : <Navigate to="/login" /> 
    },
    { 
      path: '/library', 
      element: user ? 
      <ListView
        allSongs={allSongs} 
        userLibrary={userLibrary} 
        setUserLibrary={setUserLibrary} 
      /> 
      : <Navigate to="/login" /> 
    },
    { path: '/login', element: !user ? <Login /> : <Navigate to="/" /> },
    { path: '/forgotpassword', element: <ForgotPassword /> },
    { path: '/enterOtp', element: <EnterOtp /> },
    { path: '/resetPassword', element: <ResetPassword /> },
    { path: '/signup', element: !user ? <Signup /> : <Navigate to="/" /> },
    { path: '/profile', element: user ? <Profile /> : <Navigate to="/login" /> }
  ];

  return (
    <div className='App'>
      {allSongs ? <Router>
        <Routes>
          {routes.map(({ path, element }) => (
            <Route key={path} exact path={path} element={element} />
          ))}
        </Routes>
      {user ? <SongPlayer songs={allSongs}/> : null }
      </Router> : <p className="error">{"App Failed"}</p>}
    </div>
  );
}

export default App;
