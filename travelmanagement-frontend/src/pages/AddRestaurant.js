import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Alert, 
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function AddRestaurant() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [form, setForm] = useState({
    name: '',
    location: '',
    address: '',
    cuisine: '',
    cuisineType: '',
    destinationId: '',
    image: null
  });

  useEffect(() => {
    // Protect the route - only admin can access
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    
    // Fetch destinations for the dropdown
    fetchDestinations();
  }, [user, navigate]);

  const fetchDestinations = async () => {
    try {
      const response = await axios.get('/api/admin/destinations');
      setDestinations(response.data);
    } catch (err) {
      setError('Failed to fetch destinations');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
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
      formData.append('address', form.address);
      formData.append('cuisine', form.cuisine);
      formData.append('cuisineType', form.cuisineType);
      if (form.destinationId) {
        formData.append('destinationId', form.destinationId);
      }
      if (form.image) {
        formData.append('image', form.image);
      }
      
      // Add username to form data
      formData.append('username', user?.username || 'admin');

      await axios.post('/api/admin/restaurants', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Restaurant added successfully!');
      setTimeout(() => {
        navigate('/view-restaurants');
      }, 2000);
    } catch (err) {
      console.error('Error adding restaurant:', err);
      // Fix error handling to ensure we're displaying a string, not an object
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'string') {
          setError(err.response.data);
        } else if (err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('Failed to add restaurant: ' + (err.response.status || 'Unknown error'));
        }
      } else {
        setError('Failed to add restaurant');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
        <Typography variant="h4" gutterBottom>
          Add New Restaurant
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Restaurant Name"
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
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            margin="normal"
            required
            multiline
            rows={2}
          />
          
          <TextField
            fullWidth
            label="Cuisine"
            name="cuisine"
            value={form.cuisine}
            onChange={handleChange}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Cuisine Type"
            name="cuisineType"
            value={form.cuisineType}
            onChange={handleChange}
            margin="normal"
            required
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Destination</InputLabel>
            <Select
              name="destinationId"
              value={form.destinationId}
              onChange={handleChange}
              label="Destination"
            >
              {destinations.map((dest) => (
                <MenuItem key={dest.id} value={dest.id}>
                  {dest.name}, {dest.country}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Box sx={{ mt: 2, mb: 2 }}>
            <input
              accept="image/*"
              type="file"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              id="restaurant-image-upload"
            />
            <label htmlFor="restaurant-image-upload">
              <Button variant="outlined" component="span">
                Upload Restaurant Image
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
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Restaurant'}
          </Button>
        </form>
      </Box>
    </>
  );
}