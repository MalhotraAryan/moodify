import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { baseURL } from './base';
import axios from 'axios';

var allSongs = null

await axios.get(baseURL + '/api/song')
.then((res) => {
  console.log(res)
  if (res.data.message === "OK") {
    allSongs = res.data.data
  }
})
.catch((err) => console.log(err))

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContextProvider>
    <React.StrictMode>
      <App allSongs={allSongs}/>
    </React.StrictMode>
  </AuthContextProvider>
);
