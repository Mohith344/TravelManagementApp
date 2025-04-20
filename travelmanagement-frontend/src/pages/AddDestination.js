import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function AddDestination() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    name: '',
    country: '',
    description: '',
    image: null
  });

  useEffect(() => {
    // Protect the route - only admin can access
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('country', form.country);
    formData.append('description', form.description);
    if (form.image) {
      formData.append('image', form.image);
    }

    try {
      await axios.post('/api/admin/destinations', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('Destination added successfully!');
      // Clear form
      setForm({
        name: '',
        country: '',
        description: '',
        image: null
      });
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setError(err.response?.data || 'Failed to add destination');
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
        <Typography variant="h4" gutterBottom>
          Add New Destination
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Destination Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Country"
            name="country"
            value={form.country}
            onChange={handleChange}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            margin="normal"
            required
            multiline
            rows={4}
          />
          
          <Box sx={{ mt: 2, mb: 2 }}>
            <input
              accept="image/*"
              type="file"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              id="destination-image-upload"
            />
            <label htmlFor="destination-image-upload">
              <Button variant="outlined" component="span">
                Upload Destination Image
              </Button>
            </label>
            {form.image && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected file: {form.image.name}
              </Typography>
            )}
          </Box>

          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            size="large"
            sx={{ mt: 2 }}
          >
            Add Destination
          </Button>
        </form>
      </Box>
    </>
  );
}