import React, { useState } from 'react';
import { Box, TextField, Button, Typography, MenuItem, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', role: '', travelAgencyName: '' });
  const [showAgencyField, setShowAgencyField] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'role') {
      setShowAgencyField(value === 'TRAVEL_AGENCY');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      // Register the user
      const response = await axios.post('/users/register', form);

      // Automatically log in the user after registration
      const userData = {
        username: form.username,
        isLoggedIn: true
      };
      login(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      // Redirect to home page
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data || 'Registration failed. Please try again.');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Typography variant="h5" gutterBottom>Register</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Username" name="username" margin="normal" onChange={handleChange} />
        <TextField fullWidth label="Email" name="email" margin="normal" onChange={handleChange} />
        <TextField fullWidth label="Password" name="password" type="password" margin="normal" onChange={handleChange} />
        <TextField
          select
          fullWidth
          label="Role"
          name="role"
          margin="normal"
          onChange={handleChange}
          value={form.role}
        >
          <MenuItem value="TRAVELLER">TRAVELLER</MenuItem>
          <MenuItem value="TRAVEL_AGENCY">TRAVEL AGENCY</MenuItem>
        </TextField>
        {showAgencyField && (
          <TextField
            fullWidth
            label="Travel Agency Name"
            name="travelAgencyName"
            margin="normal"
            onChange={handleChange}
          />
        )}
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>Register</Button>
      </form>
    </Box>
  );
}