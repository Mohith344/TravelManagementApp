import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import ImageCarousel from '../components/ImageCarousel';
import HeroSection from '../components/HeroSection';
import ContactUs from '../components/ContactUs';
import Login from './Login';
import Register from './Register';
import { Modal, Box, Card, CardContent, Typography, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [carouselImages, setCarouselImages] = useState([]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  console.log('User:', user);
  console.log(user?.role);

  useEffect(() => {
    // Fetch images from backend (replace with your endpoint)
    axios.get('/images') // You may need to implement this endpoint
      .then(res => setCarouselImages(res.data))
      .catch(() => setCarouselImages([
        { url: process.env.PUBLIC_URL + '/assets/sample1.jpg', alt: 'Sample 1' },
        { url: process.env.PUBLIC_URL + '/assets/sample2.jpg', alt: 'Sample 2' }
      ]));
  }, []);

  useEffect(() => {
    if (user) {
      setIsLoginOpen(false);
      setIsRegisterOpen(false);
    }
  }, [user]);

  const handleSearch = (query) => {
    // Implement search logic or navigation
    alert('Search for: ' + query);
  };

  const toggleLoginModal = () => {
    setIsLoginOpen(!isLoginOpen);
  };

  const toggleRegisterModal = () => {
    setIsRegisterOpen(!isRegisterOpen);
  };

  const handleCreatePackage = () => {
    navigate('/create-package');
  };

  const handleViewPackages = () => {
    navigate('/view-packages');
  };

  const handleAddRestaurant = () => {
    alert('Redirect to Add Restaurant');
  };

  const handleViewRestaurants = () => {
    alert('Redirect to View Restaurants');
  };

  const handleAddHotel = () => {
    alert('Redirect to Add Hotel');
  };

  const handleViewHotels = () => {
    alert('Redirect to View Hotels');
  };

  const handleAddDestination = () => {
    alert('Redirect to Add Destination');
  };

  const handleViewDestinations = () => {
    alert('Redirect to View Destinations');
  };

  return (
    <>
      <Navbar onLoginClick={toggleLoginModal} onRegisterClick={toggleRegisterModal} />
      <SearchBar onSearch={handleSearch} />
      <ImageCarousel images={carouselImages} />
      {user?.role === 'TRAVEL_AGENCY' ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 4 }}>
          <Card sx={{ maxWidth: 300 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Create Packages</Typography>
              <Typography variant="body2" color="text.secondary">
                Create new travel packages to offer to your customers.
              </Typography>
              <Button variant="contained" sx={{ mt: 2 }} onClick={handleCreatePackage}>
                Create Package
              </Button>
            </CardContent>
          </Card>
          <Card sx={{ maxWidth: 300 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>View Packages</Typography>
              <Typography variant="body2" color="text.secondary">
                View and manage all the packages you have created.
              </Typography>
              <Button variant="contained" sx={{ mt: 2 }} onClick={handleViewPackages}>
                View Packages
              </Button>
            </CardContent>
          </Card>
        </Box>
      ) : user?.role === 'ADMIN' ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4, mt: 4 }}>
          <Card sx={{ maxWidth: 300 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Add Restaurant</Typography>
              <Typography variant="body2" color="text.secondary">
                Add new restaurants to the system.
              </Typography>
              <Button variant="contained" sx={{ mt: 2 }} onClick={handleAddRestaurant}>
                Add Restaurant
              </Button>
            </CardContent>
          </Card>
          <Card sx={{ maxWidth: 300 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>View Restaurants</Typography>
              <Typography variant="body2" color="text.secondary">
                View and manage all added restaurants.
              </Typography>
              <Button variant="contained" sx={{ mt: 2 }} onClick={handleViewRestaurants}>
                View Restaurants
              </Button>
            </CardContent>
          </Card>
          <Card sx={{ maxWidth: 300 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Add Hotel</Typography>
              <Typography variant="body2" color="text.secondary">
                Add new hotels to the system.
              </Typography>
              <Button variant="contained" sx={{ mt: 2 }} onClick={handleAddHotel}>
                Add Hotel
              </Button>
            </CardContent>
          </Card>
          <Card sx={{ maxWidth: 300 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>View Hotels</Typography>
              <Typography variant="body2" color="text.secondary">
                View and manage all added hotels.
              </Typography>
              <Button variant="contained" sx={{ mt: 2 }} onClick={handleViewHotels}>
                View Hotels
              </Button>
            </CardContent>
          </Card>
          <Card sx={{ maxWidth: 300 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Add Destination</Typography>
              <Typography variant="body2" color="text.secondary">
                Add new destinations to the system.
              </Typography>
              <Button variant="contained" sx={{ mt: 2 }} onClick={handleAddDestination}>
                Add Destination
              </Button>
            </CardContent>
          </Card>
          <Card sx={{ maxWidth: 300 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>View Destinations</Typography>
              <Typography variant="body2" color="text.secondary">
                View and manage all added destinations.
              </Typography>
              <Button variant="contained" sx={{ mt: 2 }} onClick={handleViewDestinations}>
                View Destinations
              </Button>
            </CardContent>
          </Card>
        </Box>
      ) : (
        <>
          <HeroSection />
          <ContactUs />
        </>
      )}
      <Modal open={isLoginOpen} onClose={toggleLoginModal}>
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, background: 'white', p: 4, borderRadius: 2 }}>
          <Login />
        </Box>
      </Modal>
      <Modal open={isRegisterOpen} onClose={toggleRegisterModal}>
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, background: 'white', p: 4, borderRadius: 2 }}>
          <Register />
        </Box>
      </Modal>
    </>
  );
}