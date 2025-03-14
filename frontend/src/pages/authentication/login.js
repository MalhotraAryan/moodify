import React, { useState } from 'react';
import { useLogin } from '../../hooks/useLogin';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, error, isLoading } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, username, password);
    };

    return (
        <form className='login' onSubmit={handleSubmit}>
            <h3>Login</h3>
            <label>Email: </label>
            <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
            />
            <label className='or-login'>OR</label>
            <label>Username: </label>
            <input
                type="username"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
            />
            <label>Password: </label>
            <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
            />
            <button disabled={isLoading}>Log in</button>
            <Typography className='add-top-margin'>Don't have an account?<Link to='/signup' className='link'> Create an account here!</Link></Typography>
            <Typography className='add-top-margin'>Forgot your password?<Link to='/forgotpassword' className='link'> Reset it here!</Link></Typography>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default Login 