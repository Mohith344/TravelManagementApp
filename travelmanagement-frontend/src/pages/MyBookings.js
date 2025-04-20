import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar';
import EventIcon from '@mui/icons-material/Event';
import HotelIcon from '@mui/icons-material/Hotel';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CancelIcon from '@mui/icons-material/Cancel';
import dayjs from 'dayjs';

export default function MyBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [accessDenied, setAccessDenied] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    // Protect the route - only logged-in users can access
    if (!user) {
      navigate('/login', { state: { from: '/my-bookings' } });
      return;
    }

    // Check if user has TRAVELLER role
    if (user.role !== 'TRAVELLER' && user.role !== 'ROLE_TRAVELLER') {
      setAccessDenied(true);
      setLoading(false);
      return;
    }

    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/bookings/user/${user.id}`);
      setBookings(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load your bookings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking);
    setOpenCancelDialog(true);
  };

  const confirmCancelBooking = async () => {
    if (!selectedBooking) return;

    try {
      setCancelling(true);
      await axios.delete(`/api/bookings/${selectedBooking.id}`);
      
      // Remove the cancelled booking from state
      setBookings(bookings.filter(b => b.id !== selectedBooking.id));
      setOpenCancelDialog(false);
      setSelectedBooking(null);
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError('Failed to cancel booking. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  const closeCancelDialog = () => {
    setOpenCancelDialog(false);
    setSelectedBooking(null);
  };

  const isUpcoming = (travelDateStr) => {
    const today = dayjs();
    const travelDate = dayjs(travelDateStr);
    return travelDate.isAfter(today, 'day');
  };

  // Format date from ISO format to readable format
  const formatDate = (dateStr) => {
    return dayjs(dateStr).format('MMMM D, YYYY');
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

  if (accessDenied) {
    return (
      <>
        <Navbar />
        <Box sx={{ p: 3, maxWidth: 800, mx: 'auto', textAlign: 'center', mt: 4 }}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            Only travelers can view bookings.
          </Alert>
          <Typography variant="h5" gutterBottom>
            Please register as a traveler to view and manage bookings
          </Typography>
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

  return (
    <>
      <Navbar />
      <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Bookings
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {bookings.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6">
              You don't have any bookings yet.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/view-travel-packages')}
              sx={{ mt: 2 }}
            >
              Explore Travel Packages
            </Button>
          </Box>
        ) : (
          <>
            <Typography variant="h5" sx={{ mb: 2, mt: 4 }}>
              Upcoming Trips
            </Typography>
            <Grid container spacing={3}>
              {bookings
                .filter(booking => isUpcoming(booking.travelDate))
                .map((booking) => (
                  <Grid item xs={12} md={6} key={booking.id}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Typography variant="h5" gutterBottom>
                            {booking.travelPackage.name}
                          </Typography>
                          <Chip 
                            icon={<AttachMoneyIcon />}
                            label={`$${booking.totalPrice}`}
                            color="primary"
                          />
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography>
                            Travel Date: {formatDate(booking.travelDate)}
                          </Typography>
                        </Box>

                        <Typography variant="body2" color="text.secondary" paragraph>
                          {booking.travelPackage.description}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                          {booking.travelPackage.hotels && (
                            <Chip 
                              icon={<HotelIcon />}
                              label={`${booking.travelPackage.hotels.length} Hotels`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                          {booking.travelPackage.restaurants && (
                            <Chip 
                              icon={<RestaurantIcon />}
                              label={`${booking.travelPackage.restaurants.length} Restaurants`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Button 
                            variant="outlined" 
                            color="error"
                            startIcon={<CancelIcon />}
                            onClick={() => handleCancelBooking(booking)}
                          >
                            Cancel Booking
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>

            <Typography variant="h5" sx={{ mb: 2, mt: 4 }}>
              Past Trips
            </Typography>
            <Grid container spacing={3}>
              {bookings
                .filter(booking => !isUpcoming(booking.travelDate))
                .map((booking) => (
                  <Grid item xs={12} md={6} key={booking.id}>
                    <Card sx={{ height: '100%', opacity: 0.8 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Typography variant="h5" gutterBottom>
                            {booking.travelPackage.name}
                          </Typography>
                          <Chip 
                            icon={<AttachMoneyIcon />}
                            label={`$${booking.totalPrice}`}
                          />
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <EventIcon sx={{ mr: 1 }} />
                          <Typography>
                            Travel Date: {formatDate(booking.travelDate)}
                          </Typography>
                        </Box>

                        <Typography variant="body2" color="text.secondary" paragraph>
                          {booking.travelPackage.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </>
        )}

        {/* Cancel Booking Confirmation Dialog */}
        <Dialog open={openCancelDialog} onClose={closeCancelDialog}>
          <DialogTitle>Confirm Cancellation</DialogTitle>
          <DialogContent>
            <Typography variant="body1" paragraph>
              Are you sure you want to cancel this booking?
            </Typography>
            {selectedBooking && (
              <>
                <Typography variant="h6">{selectedBooking.travelPackage.name}</Typography>
                <Typography variant="body1">
                  Travel Date: {formatDate(selectedBooking.travelDate)}
                </Typography>
                <Typography variant="body1">
                  Total Price: ${selectedBooking.totalPrice}
                </Typography>
              </>
            )}
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeCancelDialog}>No, Keep Booking</Button>
            <Button 
              onClick={confirmCancelBooking} 
              color="error" 
              variant="contained"
              disabled={cancelling}
            >
              {cancelling ? <CircularProgress size={24} /> : 'Yes, Cancel Booking'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}