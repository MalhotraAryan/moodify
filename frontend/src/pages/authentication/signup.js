import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import React, { useState } from "react";
import {useSignup} from '../../hooks/useSignup';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signup, isLoading, error } = useSignup();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(username, email, password);
        await signup(username, email, password);
    };

    return (
        <form className='signup' onSubmit={handleSubmit}>
            <h3>Sign Up</h3>
            <label>Username: </label>
            <input
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
            />
            <label>Email: </label>
            <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
            />
            <label>Password: </label>
            <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
            />
            <button disabled={isLoading}>Create Account</button>
            <Typography className='add-top-margin '>Already made an account?<Link to='/login' className='link'>&nbsp;Login here!</Link></Typography>
            {error && <div className='error'>{error}</div>}
        </form>
    )
}

export default Signup