import React, { useState } from 'react';
import { Typography, TextField, Button, Paper, Box, Alert } from '@mui/material';
import axios from 'axios';
import './style.css';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/useApi'; 

function LoginRegister({ setUser }) {
  const [loginName, setLoginName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!loginName.trim()) {
      setError('Login name is required');
      setIsLoading(false);
      return;
    }
    if (!password.trim()) {
      setError('Password is required');
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post('/user/login', {
        username: loginName,
        password: password
      });
      // console.log('Login response:', response.data);
      
      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
      // window.location.href = '/';
      navigate('/users');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper elevation={3} className="login-container">
      <Typography variant="h4" component="h1" gutterBottom>
        Login to Photo App
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="login_name"
          label="Login Name"
          name="login_name"
          autoComplete="username"
          autoFocus
          value={loginName}
          onChange={(e) => setLoginName(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="password"
          label="Password"
          name="password"
          autoComplete="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </Box>
    </Paper>
  );
}

export default LoginRegister;