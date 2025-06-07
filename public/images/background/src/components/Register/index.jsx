import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Alert,
} from '@mui/material';
import './styles.css';
import api from '../../lib/useApi'; 
import { useNavigate } from 'react-router-dom';

function Register({ setUser }) {
  const [registerLoginName, setRegisterLoginName] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerFirstName, setRegisterFirstName] = useState('');
  const [registerLastName, setRegisterLastName] = useState('');
  const [registerLocation, setRegisterLocation] = useState('');
  const [registerDescription, setRegisterDescription] = useState('');
  const [registerOccupation, setRegisterOccupation] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');
    
    if (!registerLoginName) {
      setRegisterError('Username is required');
      return;
    }
    if (!registerPassword) {
      setRegisterError('Password is required');
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      setRegisterError('Passwords do not match');
      return;
    }
    if (!registerFirstName) {
      setRegisterError('First name is required');
      return;
    }
    if (!registerLastName) {
      setRegisterError('Last name is required');
      return;
    }
    
    const res = await api.post('/user/register', {
      username: registerLoginName,
      password: registerPassword,
      first_name: registerFirstName,
      last_name: registerLastName,
      location: registerLocation,
      description: registerDescription,
      occupation: registerOccupation,
    });

    console.log("res", res);

    if (res.status === 201) {
      setRegisterSuccess('Registration successful! You can now log in.');
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/users')
    }
    else {
      setRegisterError('Registration failed. Please try again.');
    }
  };

  return (
    <Grid container spacing={4} className="register-container">
      {/* Registration Section */}
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Register
          </Typography>
          
          {registerError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {registerError}
            </Alert>
          )}
          
          {registerSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {registerSuccess}
            </Alert>
          )}
          
          <form onSubmit={handleRegister}>
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              value={registerLoginName}
              onChange={(e) => setRegisterLoginName(e.target.value)}
              required
            />
            
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              required
            />
            
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              margin="normal"
              value={registerConfirmPassword}
              onChange={(e) => setRegisterConfirmPassword(e.target.value)}
              required
            />
            
            <TextField
              label="First Name"
              fullWidth
              margin="normal"
              value={registerFirstName}
              onChange={(e) => setRegisterFirstName(e.target.value)}
              required
            />
            
            <TextField
              label="Last Name"
              fullWidth
              margin="normal"
              value={registerLastName}
              onChange={(e) => setRegisterLastName(e.target.value)}
              required
            />
            
            <TextField
              label="Location"
              fullWidth
              margin="normal"
              value={registerLocation}
              onChange={(e) => setRegisterLocation(e.target.value)}
            />
            
            <TextField
              label="Occupation"
              fullWidth
              margin="normal"
              value={registerOccupation}
              onChange={(e) => setRegisterOccupation(e.target.value)}
            />
            
            <TextField
              label="Description"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              value={registerDescription}
              onChange={(e) => setRegisterDescription(e.target.value)}
            />
            
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{ mt: 2 }}
            >
              Register Me
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Register;