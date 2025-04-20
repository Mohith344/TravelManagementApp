import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Paper,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function AddHotel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [form, setForm] = useState({
    name: '',
    location: '',
    pricePerNight: '',
    address: '',
    destinationId: '',
    image: null
  });

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    fetchDestinations();
  }, [user, navigate]);

  const fetchDestinations = async () => {
    try {
      let response;
      try {
        response = await axios.get('/api/admin/destinations');
      } catch (initialError) {
        // If the main endpoint fails due to serialization issues, try the debug endpoint
        response = await axios.get('/api/admin/destinations/debug');
        // If using debug endpoint, extract the actual destinations array
        if (response.data && response.data.destinations) {
          response.data = response.data.destinations;
        }
      }
      
      // Ensure destinations is always an array
      setDestinations(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching destinations:", err);
      setError('Failed to fetch destinations');
      setDestinations([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setForm(prev => ({
        ...prev,
        image: e.target.files[0]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('location', form.location);
      formData.append('pricePerNight', form.pricePerNight);
      formData.append('address', form.address);
      if (form.destinationId) {
        formData.append('destinationId', form.destinationId);
      }
      if (form.image) {
        formData.append('image', form.image);
      }
      
      // Add username to form data - use the logged in user or default to 'admin'
      formData.append('username', user?.username || 'admin');

      await axios.post('/api/admin/hotels', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Hotel added successfully!');
      setTimeout(() => {
        navigate('/view-hotels');
      }, 2000);
    } catch (err) {
      setError(err.response?.data || 'Failed to add hotel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Add New Hotel
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Hotel Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Price Per Night"
              name="pricePerNight"
              value={form.pricePerNight}
              onChange={handleChange}
              margin="normal"
              required
              type="number"
            />

            <TextField
              fullWidth
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              margin="normal"
              required
              multiline
              rows={3}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Destination</InputLabel>
              <Select
                name="destinationId"
                value={form.destinationId}
                onChange={handleChange}
                required
                label="Destination"
              >
                {Array.isArray(destinations) && destinations.length > 0 ? (
                  destinations.map((dest) => (
                    <MenuItem key={dest.id} value={dest.id}>
                      {dest.name}, {dest.country}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No destinations available</MenuItem>
                )}
              </Select>
            </FormControl>

            <Box sx={{ mt: 2, mb: 3 }}>
              <input
                accept="image/*"
                type="file"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="hotel-image-input"
              />
              <label htmlFor="hotel-image-input">
                <Button variant="outlined" component="span">
                  Upload Image
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
              fullWidth
              size="large"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Add Hotel'}
            </Button>
          </form>
        </Paper>
      </Box>
    </>
  );
}