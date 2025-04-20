import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import ImageCarousel from '../components/ImageCarousel';
import HeroSection from '../components/HeroSection';
import ContactUs from '../components/ContactUs';
import Login from './Login';
import Register from './Register';
import { Modal, Box, Card, CardContent, Typography, Button, Stack, Divider } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import HotelIcon from '@mui/icons-material/Hotel';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ViewListIcon from '@mui/icons-material/ViewList';
import LuggageIcon from '@mui/icons-material/Luggage';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function Home() {
  const [carouselImages, setCarouselImages] = useState([]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

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
    navigate('/add-restaurant');
  };

  const handleViewRestaurants = () => {
    navigate('/view-restaurants');
  };

  const handleAddHotel = () => {
    navigate('/add-hotel');
  };

  const handleViewHotels = () => {
    navigate('/view-hotels');
  };

  const handleAddDestination = () => {
    navigate('/add-destination');
  };

  const handleViewDestinations = () => {
    navigate('/view-destinations');
  };

  return (
    <>
      <Navbar onLoginClick={toggleLoginModal} onRegisterClick={toggleRegisterModal} />
      <SearchBar onSearch={handleSearch} />
      <ImageCarousel images={carouselImages} />
      {user?.role === 'TRAVEL_AGENCY' ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4, mt: 4, px: 3, maxWidth: 1200, mx: 'auto' }}>
          {/* Create Package Card */}
          <Card sx={{ width: 360, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AddCircleIcon sx={{ fontSize: 28, mr: 1, color: 'primary.main' }} />
                <Typography variant="h5">Create Package</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Create new travel packages with restaurants, hotels, and images to offer to your customers.
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Button 
                variant="contained" 
                startIcon={<LuggageIcon />}
                fullWidth 
                onClick={handleCreatePackage}
                size="large"
              >
                Create New Package
              </Button>
            </CardContent>
          </Card>

          {/* View Packages Card */}
          <Card sx={{ width: 360, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ViewListIcon sx={{ fontSize: 28, mr: 1, color: 'primary.main' }} />
                <Typography variant="h5">View Packages</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                View and manage all the packages you've created. Edit details, update images, or remove packages.
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Button 
                variant="contained" 
                startIcon={<VisibilityIcon />}
                fullWidth 
                onClick={handleViewPackages}
                size="large"
              >
                View My Packages
              </Button>
            </CardContent>
          </Card>
        </Box>
      ) : user?.role === 'ADMIN' ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4, mt: 4, px: 3, maxWidth: 1200, mx: 'auto' }}>
          {/* Restaurants Card */}
          <Card sx={{ width: 360, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <RestaurantIcon sx={{ fontSize: 28, mr: 1, color: 'primary.main' }} />
                <Typography variant="h5">Restaurants</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Add new restaurants to the system or view and manage existing ones.
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={2}>
                <Button 
                  variant="contained" 
                  startIcon={<AddCircleIcon />}
                  fullWidth 
                  onClick={handleAddRestaurant}
                >
                  Add Restaurant
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<ViewListIcon />}
                  fullWidth
                  onClick={handleViewRestaurants}
                >
                  View Restaurants
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Hotels Card */}
          <Card sx={{ width: 360, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <HotelIcon sx={{ fontSize: 28, mr: 1, color: 'primary.main' }} />
                <Typography variant="h5">Hotels</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Add new hotels to the system or view and manage existing ones.
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={2}>
                <Button 
                  variant="contained" 
                  startIcon={<AddCircleIcon />}
                  fullWidth 
                  onClick={handleAddHotel}
                >
                  Add Hotel
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<ViewListIcon />}
                  fullWidth
                  onClick={handleViewHotels}
                >
                  View Hotels
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Destinations Card */}
          <Card sx={{ width: 360, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOnIcon sx={{ fontSize: 28, mr: 1, color: 'primary.main' }} />
                <Typography variant="h5">Destinations</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Add new destinations to the system or view and manage existing ones.
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={2}>
                <Button 
                  variant="contained" 
                  startIcon={<AddCircleIcon />}
                  fullWidth 
                  onClick={handleAddDestination}
                >
                  Add Destination
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<ViewListIcon />}
                  fullWidth
                  onClick={handleViewDestinations}
                >
                  View Destinations
                </Button>
              </Stack>
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