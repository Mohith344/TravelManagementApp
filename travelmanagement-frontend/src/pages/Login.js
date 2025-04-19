import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      // Call backend login endpoint
      const response = await axios.post('/users/login', null, { params: form });

      // Extract user data from response
      const userData = {
        username: form.username,
        role: response.data.role, // Assuming role is returned in the response
        isLoggedIn: true
      };

      // Store user info in localStorage
      localStorage.setItem('user', JSON.stringify(userData));

      login(userData); // Use the login function from useAuth

      // Redirect to homepage
      navigate('/');

      // Reload page to update navbar (alternatively, you could use Context API)
      window.location.reload();
    } catch (err) {
      setError(err.response?.data || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Typography variant="h5" gutterBottom>Login</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Username" name="username" margin="normal" onChange={handleChange} />
        <TextField fullWidth label="Password" name="password" type="password" margin="normal" onChange={handleChange} />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>Login</Button>
      </form>
    </Box>
  );
}