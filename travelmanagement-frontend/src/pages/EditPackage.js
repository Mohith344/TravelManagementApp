import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Alert, Modal, Fade, CircularProgress, Grid } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function EditPackage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
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
  const [existingImages, setExistingImages] = useState({
    restaurantImages: [],
    hotelImages: []
  });

  useEffect(() => {
    // Protect the route - only logged in users can access
    if (!user) {
      navigate('/');
      return;
    }
    
    // Fetch the package details
    fetchPackageDetails();
  }, [id, user, navigate]);

  const fetchPackageDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/travel-packages/${id}`);
      const packageData = response.data;

      // Map the package data to our form
      setForm({
        packageName: packageData.name || '',
        destination: packageData.description?.replace('Package to ', '') || '',
        price: packageData.price || '',
        restaurants: packageData.restaurants?.map(r => r.name) || [''],
        hotels: packageData.hotels?.map(h => h.name) || [''],
        restaurantImages: [],
        hotelImages: [],
      });

      // Fetch existing images for this package
      try {
        const [restaurantImagesResponse, hotelImagesResponse] = await Promise.all([
          axios.get(`/images/by-type/restaurant/${id}`),
          axios.get(`/images/by-type/hotel/${id}`)
        ]);
        
        setExistingImages({
          restaurantImages: restaurantImagesResponse.data || [],
          hotelImages: hotelImagesResponse.data || []
        });
      } catch (err) {
        console.error('Error fetching images:', err);
        setExistingImages({ restaurantImages: [], hotelImages: [] });
      }

      setError('');
    } catch (err) {
      console.error('Error fetching package details:', err);
      setError('Failed to load package details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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
    setForm({ ...form, [field]: Array.from(e.target.files) });
  };

  const addField = (field) => {
    setForm({ ...form, [field]: [...form[field], ''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

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
      await axios.put(`/travel-packages/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('Package updated successfully! Redirecting...');
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate('/view-packages');
      }, 1800);
    } catch (err) {
      setError(err.response?.data || 'Failed to update package.');
      setShowModal(true);
      setTimeout(() => setShowModal(false), 1800);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      </>
    );
  }

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
        <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
          Edit Travel Package
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField 
            fullWidth 
            label="Package Name" 
            name="packageName"
            value={form.packageName} 
            margin="normal" 
            onChange={handleChange} 
            required 
          />
          <TextField 
            fullWidth 
            label="Destination" 
            name="destination"
            value={form.destination} 
            margin="normal" 
            onChange={handleChange} 
            required 
          />
          <TextField
            fullWidth
            label="Price ($)"
            name="price"
            type="number"
            value={form.price}
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

          {/* Current Restaurant Images */}
          {existingImages.restaurantImages.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>Current Restaurant Images</Typography>
              <Grid container spacing={2}>
                {existingImages.restaurantImages.map((image, index) => (
                  <Grid item xs={4} key={`restaurant-image-${index}`}>
                    <Box sx={{ 
                      width: '100%',
                      height: 120,
                      backgroundImage: `url(${image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: 1
                    }} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          <Box sx={{ border: '1px dashed grey', p: 2, borderRadius: 1, mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Upload New Restaurant Images</Typography>
            <input type="file" multiple onChange={(e) => handleFileChange(e, 'restaurantImages')} accept="image/*" />
          </Box>

          {/* Current Hotel Images */}
          {existingImages.hotelImages.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>Current Hotel Images</Typography>
              <Grid container spacing={2}>
                {existingImages.hotelImages.map((image, index) => (
                  <Grid item xs={4} key={`hotel-image-${index}`}>
                    <Box sx={{ 
                      width: '100%',
                      height: 120,
                      backgroundImage: `url(${image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: 1
                    }} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          <Box sx={{ border: '1px dashed grey', p: 2, borderRadius: 1, mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Upload New Hotel Images</Typography>
            <input type="file" multiple onChange={(e) => handleFileChange(e, 'hotelImages')} accept="image/*" />
          </Box>

          <Button type="submit" variant="contained" sx={{ mt: 3, display: 'block', mx: 'auto' }} size="large">
            Update Package
          </Button>
        </form>
      </Box>
    </>
  );
}