import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Alert, Modal, Fade, CircularProgress, Grid } from '@mui/material'; 
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function CreatePackage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    packageName: '',
    destination: '',
    price: '',
    restaurants: [''],
    hotels: [''],
    restaurantImages: [],
    hotelImages: [],
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState({
    restaurantImages: [],
    hotelImages: []
  });
  
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleArrayChange = (e, index, field) => {
    const newArray = [...form[field]];
    newArray[index] = e.target.value;
    setForm({ ...form, [field]: newArray });
  };

  const handleFileChange = (e, field) => {
    const files = Array.from(e.target.files);
    setForm({ ...form, [field]: files });
    
    // Create preview URLs for the selected images
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreview(prev => ({ ...prev, [field]: previewUrls }));
  };

  const addField = (field) => {
    setForm({ ...form, [field]: [...form[field], ''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const formData = new FormData();
    formData.append('packageName', form.packageName);
    formData.append('destination', form.destination);
    formData.append('price', form.price);
    form.restaurants.forEach((restaurant, i) => restaurant && formData.append(`restaurants[${i}]`, restaurant));
    form.hotels.forEach((hotel, i) => hotel && formData.append(`hotels[${i}]`, hotel));
    form.restaurantImages.forEach((file) => formData.append('restaurantImages', file));
    form.hotelImages.forEach((file) => formData.append('hotelImages', file));
    formData.append('username', user.username);

    try {
      await axios.post('/travel-packages/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('🎉 Package created successfully! Redirecting to your packages...');
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate('/view-packages'); // Redirect to view-packages instead of home
      }, 1800);
    } catch (err) {
      setError(err.response?.data || 'Failed to create package.');
      setShowModal(true);
      setTimeout(() => setShowModal(false), 1800);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Modal
        open={showModal && (!!success || !!error)}
        closeAfterTransition
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        disableAutoFocus
      >
        <Fade in={showModal && (!!success || !!error)}>
          <Box sx={{
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            minWidth: 340,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            outline: 'none'
          }}>
            {success && (
              <Alert severity="success" sx={{ fontSize: 18, fontWeight: 600, textAlign: 'center' }}>
                {success}
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ fontSize: 18, fontWeight: 600, textAlign: 'center' }}>
                {error}
              </Alert>
            )}
          </Box>
        </Fade>
      </Modal>
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, mb: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>Create Your Next Travel Package</Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Package Name" name="packageName" margin="normal" onChange={handleChange} required />
          <TextField fullWidth label="Destination" name="destination" margin="normal" onChange={handleChange} required />
          <TextField
            fullWidth
            label="Price ($)"
            name="price"
            type="number"
            margin="normal"
            onChange={handleChange}
            required
            InputProps={{ inputProps: { min: 0, step: "0.01" } }}
          />

          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Restaurants</Typography>
          {form.restaurants.map((restaurant, index) => (
            <TextField
              key={index}
              fullWidth
              label={`Restaurant ${index + 1}`}
              value={restaurant}
              margin="dense"
              onChange={(e) => handleArrayChange(e, index, 'restaurants')}
            />
          ))}
          <Button onClick={() => addField('restaurants')} sx={{ mt: 1, mb: 2 }} size="small">Add Restaurant</Button>

          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Hotels</Typography>
          {form.hotels.map((hotel, index) => (
            <TextField
              key={index}
              fullWidth
              label={`Hotel ${index + 1}`}
              value={hotel}
              margin="dense"
              onChange={(e) => handleArrayChange(e, index, 'hotels')}
            />
          ))}
          <Button onClick={() => addField('hotels')} sx={{ mt: 1, mb: 2 }} size="small">Add Hotel</Button>

          <Box sx={{ border: '1px dashed grey', p: 2, borderRadius: 1, mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Upload Restaurant Images</Typography>
            <input type="file" multiple onChange={(e) => handleFileChange(e, 'restaurantImages')} accept="image/*" />
            
            {/* Restaurant Image Previews */}
            {imagePreview.restaurantImages.length > 0 && (
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {imagePreview.restaurantImages.map((url, index) => (
                  <Grid item xs={4} key={`restaurant-preview-${index}`}>
                    <Box sx={{ 
                      width: '100%',
                      height: 120,
                      backgroundImage: `url(${url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: 1
                    }} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>

          <Box sx={{ border: '1px dashed grey', p: 2, borderRadius: 1, mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Upload Hotel Images</Typography>
            <input type="file" multiple onChange={(e) => handleFileChange(e, 'hotelImages')} accept="image/*" />
            
            {/* Hotel Image Previews */}
            {imagePreview.hotelImages.length > 0 && (
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {imagePreview.hotelImages.map((url, index) => (
                  <Grid item xs={4} key={`hotel-preview-${index}`}>
                    <Box sx={{ 
                      width: '100%',
                      height: 120,
                      backgroundImage: `url(${url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: 1
                    }} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>

          <Button 
            type="submit" 
            variant="contained" 
            sx={{ mt: 3, display: 'block', mx: 'auto' }} 
            size="large"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Package'}
            {loading && <CircularProgress size={24} sx={{ ml: 1 }} />}
          </Button>
        </form>
      </Box>
    </>
  );
}