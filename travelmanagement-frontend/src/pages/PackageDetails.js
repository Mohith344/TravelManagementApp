import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Grid, 
  CircularProgress, 
  Alert,
  Divider, 
  List, 
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Chip
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import HotelIcon from '@mui/icons-material/Hotel';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BusinessIcon from '@mui/icons-material/Business';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

export default function PackageDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [packageData, setPackageData] = useState(null);
  const [images, setImages] = useState({
    hotelImages: [],
    restaurantImages: []
  });
  
  useEffect(() => {
    fetchPackageDetails();
  }, [id]);
  
  const fetchPackageDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch package details
      const packageResponse = await axios.get(`/travel-packages/${id}`);
      setPackageData(packageResponse.data);
      
      // Fetch package images
      try {
        const [restaurantImagesResponse, hotelImagesResponse] = await Promise.all([
          axios.get(`/images/by-type/package_restaurant/${id}`),
          axios.get(`/images/by-type/package_hotel/${id}`)
        ]);
        
        setImages({
          restaurantImages: restaurantImagesResponse.data || [],
          hotelImages: hotelImagesResponse.data || []
        });
      } catch (imageError) {
        console.error('Error fetching images:', imageError);
      }
      
    } catch (err) {
      console.error('Error fetching package details:', err);
      setError('Failed to load package details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleBookNow = () => {
    if (!user) {
      // If user is not logged in, redirect to login page with redirect path
      navigate('/login', { state: { from: `/book-package/${id}` } });
    } else if (user.role !== 'TRAVELLER') {
      // If user is not a traveler, still navigate but they'll see access denied
      navigate(`/book-package/${id}`);
    } else {
      // If user is a traveler, navigate to booking page
      navigate(`/book-package/${id}`);
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
  
  if (error || !packageData) {
    return (
      <>
        <Navbar />
        <Box sx={{ p: 3 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || 'Package not found'}
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
  
  const hasImages = images.restaurantImages.length > 0 || images.hotelImages.length > 0;
  
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
          Back to Search Results
        </Button>
        
        <Grid container spacing={4}>
          {/* Left Column - Images */}
          <Grid item xs={12} md={6}>
            {hasImages ? (
              <Carousel showThumbs={true} infiniteLoop>
                {images.restaurantImages.map((image, index) => (
                  <div key={`restaurant-${index}`}>
                    <img
                      src={`/${image.filePath}`}
                      alt={`Restaurant ${index + 1}`}
                      style={{ maxHeight: '400px', objectFit: 'cover' }}
                    />
                    <p className="legend">Restaurant View</p>
                  </div>
                ))}
                
                {images.hotelImages.map((image, index) => (
                  <div key={`hotel-${index}`}>
                    <img
                      src={`/${image.filePath}`}
                      alt={`Hotel ${index + 1}`}
                      style={{ maxHeight: '400px', objectFit: 'cover' }}
                    />
                    <p className="legend">Hotel View</p>
                  </div>
                ))}
              </Carousel>
            ) : (
              <Paper sx={{ 
                height: 400, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: '#f5f5f5'
              }}>
                <Typography variant="h6" color="text.secondary">
                  No Images Available
                </Typography>
              </Paper>
            )}
          </Grid>
          
          {/* Right Column - Details */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography variant="h4" component="h1">
                {packageData.name}
              </Typography>
              <Chip 
                icon={<AttachMoneyIcon />} 
                label={`$${packageData.price}`}
                color="primary"
                size="large"
              />
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">
                Offered by: {packageData.travelAgencyName || 'Travel Agency'}
              </Typography>
            </Box>
            
            <Typography variant="body1" paragraph>
              {packageData.description}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              Hotels Included
            </Typography>
            
            {packageData.hotels && packageData.hotels.length > 0 ? (
              <List>
                {packageData.hotels.map((hotel, index) => (
                  <ListItem key={`hotel-${index}`} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <HotelIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={hotel.name} 
                      secondary={hotel.location}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No hotels specified for this package
              </Typography>
            )}
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              Restaurants Included
            </Typography>
            
            {packageData.restaurants && packageData.restaurants.length > 0 ? (
              <List>
                {packageData.restaurants.map((restaurant, index) => (
                  <ListItem key={`restaurant-${index}`} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <RestaurantIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={restaurant.name} 
                      secondary={restaurant.cuisine || restaurant.location}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No restaurants specified for this package
              </Typography>
            )}
            
            <Divider sx={{ my: 2 }} />
            
            <Button 
              variant="contained" 
              color="primary" 
              size="large" 
              fullWidth
              onClick={handleBookNow}
              sx={{ mt: 2 }}
            >
              Book This Package
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}