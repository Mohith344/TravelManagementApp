import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Grid, 
  CircularProgress, 
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

// We'll use regular date inputs instead of MUI date pickers to avoid dependency issues
export default function BookDestination() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [destination, setDestination] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  
  // Booking form state
  const [form, setForm] = useState({
    travelDate: '',
    returnDate: '',
    numberOfPeople: 1,
    hotelId: '',
    specialRequests: ''
  });

  // Check if user is logged in and has TRAVELLER role
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: `/destination-details/${id}` } });
    } else if (user.role !== 'TRAVELLER') {
      setAccessDenied(true);
      setLoading(false);
    } else {
      fetchDestinationDetails();
    }
  }, [user, id, navigate]);

  const fetchDestinationDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch destination details
      const destinationResponse = await axios.get(`/api/admin/destinations/${id}`);
      setDestination(destinationResponse.data);
      
      // Fetch hotels for this destination
      const hotelsResponse = await axios.get(`/api/admin/destinations/${id}/hotels`);
      const hotelsData = Array.isArray(hotelsResponse.data) ? hotelsResponse.data : [];
      console.log('Hotels data:', hotelsData); // Debugging
      setHotels(hotelsData);
      
    } catch (err) {
      console.error('Error fetching destination details:', err);
      setError('Failed to load destination details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Add this debug function to check what's happening with hotels
  useEffect(() => {
    console.log('Current hotels state:', hotels);
  }, [hotels]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field ${name} changed to:`, value); // Debug logging
    setForm(prev => ({ ...prev, [name]: value }));
  };
  
  const calculateTotalPrice = () => {
    if (!form.hotelId || !form.travelDate || !form.returnDate) return 0;
    
    const hotel = hotels.find(h => h.id.toString() === form.hotelId.toString());
    if (!hotel) return 0;
    
    // Calculate number of days between dates
    const startDate = new Date(form.travelDate);
    const endDate = new Date(form.returnDate);
    
    // Check if dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 0;
    
    const days = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));
    const pricePerNight = hotel.pricePerNight || 0;
    
    return pricePerNight * days * form.numberOfPeople;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.travelDate || !form.returnDate || !form.hotelId) {
      setError('Please fill in all required fields');
      return;
    }
    
    const startDate = new Date(form.travelDate);
    const endDate = new Date(form.returnDate);
    
    if (startDate > endDate) {
      setError('Return date must be after travel date');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // This is a placeholder - you would need to implement the booking endpoint in your backend
      const bookingData = {
        userId: user.id,
        destinationId: id,
        hotelId: form.hotelId,
        travelDate: form.travelDate,
        returnDate: form.returnDate,
        numberOfPeople: form.numberOfPeople,
        specialRequests: form.specialRequests,
        totalPrice: calculateTotalPrice()
      };
      
      // Simulate a booking API call
      // In a real app, you would call your booking API
      // await axios.post('/api/bookings', bookingData);
      
      // For demo purposes:
      console.log('Booking data:', bookingData);
      setTimeout(() => {
        setBookingSuccess(true);
        setLoading(false);
      }, 1500);
      
    } catch (err) {
      console.error('Error creating booking:', err);
      setError('Failed to create booking. Please try again later.');
      setLoading(false);
    }
  };
  
  // Access denied message for non-traveller users
  if (accessDenied) {
    return (
      <>
        <Navbar />
        <Box sx={{ p: 3, maxWidth: 800, mx: 'auto', textAlign: 'center', mt: 4 }}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            Only travelers can book destinations.
          </Alert>
          <Typography variant="h5" gutterBottom>
            Please register as a traveler to book destinations
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/destination-details/' + id)} 
            sx={{ mt: 2, mr: 2 }}
          >
            View Destination Details
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/')} 
            sx={{ mt: 2 }}
          >
            Return to Home
          </Button>
        </Box>
      </>
    );
  }
  
  // Show success message after booking
  if (bookingSuccess) {
    return (
      <>
        <Navbar />
        <Box sx={{ p: 3, maxWidth: 800, mx: 'auto', textAlign: 'center', mt: 4 }}>
          <Alert severity="success" sx={{ mb: 3 }}>
            Your booking has been successfully created!
          </Alert>
          <Typography variant="h5" gutterBottom>
            Thank you for booking your trip to {destination?.name}
          </Typography>
          <Typography paragraph>
            We've sent a confirmation email with your booking details.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/')} 
            sx={{ mt: 2 }}
          >
            Return to Home
          </Button>
        </Box>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <CircularProgress />
        </Box>
      </>
    );
  }
  
  if (error || !destination) {
    return (
      <>
        <Navbar />
        <Box sx={{ p: 3 }}>
          <Alert severity="error">
            {error || 'Destination not found'}
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => navigate(-1)} 
            sx={{ mt: 2 }}
          >
            Go Back
          </Button>
        </Box>
      </>
    );
  }
  
  return (
    <>
      <Navbar />
      <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h4" gutterBottom>
          Book Your Trip to {destination.name}
        </Typography>
        <Paper elevation={3} sx={{ p: 3, mt: 2, mb: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Travel Date"
                  name="travelDate"
                  type="date"
                  value={form.travelDate}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: new Date().toISOString().split('T')[0] }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Return Date"
                  name="returnDate"
                  type="date"
                  value={form.returnDate}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: form.travelDate || new Date().toISOString().split('T')[0] }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Number of People"
                  name="numberOfPeople"
                  type="number"
                  value={form.numberOfPeople}
                  onChange={handleChange}
                  fullWidth
                  required
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel id="hotel-select-label">Select Hotel</InputLabel>
                  <Select
                    labelId="hotel-select-label"
                    name="hotelId"
                    value={form.hotelId}
                    onChange={handleChange}
                    label="Select Hotel"
                  >
                    {hotels && hotels.length > 0 ? (
                      hotels.map((hotel) => (
                        <MenuItem key={hotel.id} value={hotel.id}>
                          {hotel.name} - ${hotel.pricePerNight} per night
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="" disabled>No hotels available</MenuItem>
                    )}
                  </Select>
                </FormControl>
                {hotels.length === 0 && (
                  <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                    No hotels found for this destination
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Special Requests or Notes"
                  name="specialRequests"
                  value={form.specialRequests}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={4}
                />
              </Grid>
            </Grid>
            
            {error && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {error}
              </Alert>
            )}
            
            {/* Price Summary */}
            <Card sx={{ mt: 3, mb: 3, backgroundColor: '#f5f5f5' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Price Summary
                </Typography>
                <Grid container>
                  <Grid item xs={8}>
                    <Typography>Total Price:</Typography>
                  </Grid>
                  <Grid item xs={4} sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" color="primary">
                      ${calculateTotalPrice().toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Complete Booking'}
            </Button>
          </form>
        </Paper>
      </Box>
    </>
  );
}