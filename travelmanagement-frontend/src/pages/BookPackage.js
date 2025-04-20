import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Input,
  InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HotelIcon from '@mui/icons-material/Hotel';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import dayjs from 'dayjs';

export default function BookPackage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [packageData, setPackageData] = useState(null);
  const [bookingDate, setBookingDate] = useState(dayjs());
  const [travelDate, setTravelDate] = useState(dayjs().add(7, 'day'));
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  useEffect(() => {
    // Protect the route - only logged-in users can access
    if (!user) {
      navigate('/login', { state: { from: `/book-package/${id}` } });
      return;
    }

    // Only travelers can book packages
    if (user.role !== 'TRAVELLER' && user.role !== 'ROLE_TRAVELLER') {
      setError('Only travelers can book packages');
      setLoading(false);
      return;
    }

    fetchPackageDetails();
  }, [user, navigate, id]);

  const fetchPackageDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/travel-packages/${id}`);
      setPackageData(response.data);
    } catch (err) {
      console.error('Error fetching package details:', err);
      setError('Failed to load package details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingConfirm = async () => {
    if (!user || !packageData) return;

    try {
      setSubmitting(true);
      
      // Create booking data
      const bookingData = {
        userId: user.id,
        travelPackageId: packageData.id,
        bookingDate: bookingDate.format('YYYY-MM-DD'),
        travelDate: travelDate.format('YYYY-MM-DD'),
        totalPrice: packageData.price
      };
      
      const response = await axios.post('/api/bookings', bookingData);
      setBookingId(response.data.id);
      setBookingComplete(true);
      setShowConfirmation(false);
    } catch (err) {
      console.error('Error creating booking:', err);
      setError('Failed to complete booking. Please try again.');
      setShowConfirmation(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate dates
    if (travelDate < bookingDate) {
      setError('Travel date must be after booking date');
      return;
    }
    setShowConfirmation(true);
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

  if (error) {
    return (
      <>
        <Navbar />
        <Box sx={{ p: 3 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            variant="outlined"
          >
            Go Back
          </Button>
        </Box>
      </>
    );
  }

  if (bookingComplete) {
    return (
      <>
        <Navbar />
        <Box sx={{ p: 3, maxWidth: 600, mx: 'auto', textAlign: 'center' }}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Booking Confirmed!
            </Typography>
            <Typography variant="body1" paragraph>
              Your booking for {packageData?.name} has been successfully completed.
            </Typography>
            <Typography variant="body1" paragraph>
              Booking ID: #{bookingId}
            </Typography>
            <Typography variant="body1" paragraph>
              Travel Date: {travelDate.format('MMMM D, YYYY')}
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Total Amount: ${packageData?.price}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/')}
              sx={{ mt: 3 }}
            >
              Return to Home
            </Button>
          </Paper>
        </Box>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          variant="outlined"
          sx={{ mb: 3 }}
        >
          Back
        </Button>

        <Typography variant="h4" component="h1" gutterBottom>
          Book Package: {packageData?.name}
        </Typography>

        <Grid container spacing={4}>
          {/* Package Summary */}
          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 3 }}>
              {packageData?.coverImage ? (
                <CardMedia
                  component="img"
                  height="200"
                  image={packageData.coverImage}
                  alt={packageData.name}
                  sx={{ objectFit: 'cover' }}
                />
              ) : null}
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5">
                    {packageData?.name}
                  </Typography>
                  <Chip
                    icon={<AttachMoneyIcon />}
                    label={`$${packageData?.price}`}
                    color="primary"
                    size="medium"
                  />
                </Box>

                <Typography variant="body1" color="text.secondary" paragraph>
                  {packageData?.description}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                  Includes:
                </Typography>
                <List dense>
                  {packageData?.hotels && packageData.hotels.map((hotel, index) => (
                    <ListItem key={`hotel-${index}`}>
                      <ListItemIcon>
                        <HotelIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={hotel.name} />
                    </ListItem>
                  ))}
                  {packageData?.restaurants && packageData.restaurants.map((restaurant, index) => (
                    <ListItem key={`restaurant-${index}`}>
                      <ListItemIcon>
                        <RestaurantIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={restaurant.name} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Booking Form */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
              <Typography variant="h5" gutterBottom>
                Complete Your Booking
              </Typography>
              <form onSubmit={handleSubmit}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Today's Date:
                    </Typography>
                    <DatePicker
                      label="Booking Date"
                      value={bookingDate.toDate()}
                      disabled
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Select Travel Date:
                    </Typography>
                    <DatePicker
                      label="Travel Date"
                      value={travelDate.toDate()}
                      onChange={(date) => setTravelDate(dayjs(date))}
                      minDate={new Date()}
                      renderInput={(params) => <TextField {...params} fullWidth required />}
                    />
                  </Box>
                </LocalizationProvider>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6">Traveler Information</Typography>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Name"
                        value={user?.name || user?.username || ''}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        value={user?.email || ''}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>Price Summary</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">Package Price:</Typography>
                    <Typography variant="body1">${packageData?.price}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">Taxes & Fees:</Typography>
                    <Typography variant="body1">Included</Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h6">${packageData?.price}</Typography>
                  </Box>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  sx={{ mt: 2 }}
                >
                  Proceed to Book
                </Button>
              </form>
            </Paper>
          </Grid>
        </Grid>

        {/* Booking Confirmation Dialog */}
        <Dialog open={showConfirmation} onClose={() => setShowConfirmation(false)}>
          <DialogTitle>Confirm Your Booking</DialogTitle>
          <DialogContent>
            <Typography variant="body1" paragraph>
              You are about to book the following package:
            </Typography>
            <Typography variant="h6">{packageData?.name}</Typography>
            <Box sx={{ my: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EventIcon sx={{ mr: 1 }} />
                <Typography>Travel Date: {travelDate.format('MMMM D, YYYY')}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PersonIcon sx={{ mr: 1 }} />
                <Typography>Traveler: {user?.name || user?.username}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AttachMoneyIcon sx={{ mr: 1 }} />
                <Typography>Total Price: ${packageData?.price}</Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
              By confirming, you agree to the booking terms and conditions.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowConfirmation(false)}>Cancel</Button>
            <Button
              onClick={handleBookingConfirm}
              variant="contained"
              color="primary"
              disabled={submitting}
            >
              {submitting ? <CircularProgress size={24} /> : 'Confirm Booking'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}