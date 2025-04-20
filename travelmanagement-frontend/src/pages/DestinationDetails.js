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
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Rating
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import HotelIcon from '@mui/icons-material/Hotel';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BedroomParentIcon from '@mui/icons-material/BedroomParent';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import { useAuth } from '../context/AuthContext';

export default function DestinationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [destination, setDestination] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  
  useEffect(() => {
    fetchDestinationDetails();
  }, [id]);
  
  const fetchDestinationDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch destination details
      const destinationResponse = await axios.get(`/api/admin/destinations/${id}`);
      setDestination(destinationResponse.data);
      
      // Fetch hotels for this destination
      const hotelsResponse = await axios.get(`/api/admin/destinations/${id}/hotels`);
      setHotels(Array.isArray(hotelsResponse.data) ? hotelsResponse.data : []);
      
      // Fetch restaurants for this destination
      const restaurantsResponse = await axios.get(`/api/admin/destinations/${id}/restaurants`);
      setRestaurants(Array.isArray(restaurantsResponse.data) ? restaurantsResponse.data : []);
      
    } catch (err) {
      console.error('Error fetching destination details:', err);
      setError('Failed to load destination details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleBookNow = () => {
    if (!user) {
      // If user is not logged in, redirect to login page
      navigate('/login', { state: { from: `/destination-details/${id}` } });
    } else if (user.role !== 'TRAVELLER') {
      // If user is not a traveler, show a message
      navigate(`/book-destination/${id}`); // They'll see the access denied message there
    } else {
      // Otherwise navigate to booking page
      navigate(`/book-destination/${id}`);
    }
  };
  
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
      <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
        {/* Hero Section */}
        <Paper 
          elevation={3} 
          sx={{ 
            position: 'relative', 
            height: 400, 
            mb: 4, 
            backgroundImage: destination.imagePath 
              ? `url(/${destination.imagePath})` 
              : `url(${process.env.PUBLIC_URL}/assets/sample1.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: 2
          }}
        >
          <Box 
            sx={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0, 
              right: 0,
              p: 3, 
              background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
              color: 'white',
              borderRadius: '0 0 8px 8px'
            }}
          >
            <Typography variant="h3">{destination.name}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <LocationOnIcon sx={{ mr: 1 }} />
              <Typography variant="h6">{destination.country}</Typography>
            </Box>
          </Box>
        </Paper>
        
        {/* Description and Booking */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Typography variant="h5" gutterBottom>About this Destination</Typography>
            <Typography paragraph>
              {destination.description}
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                What's Available
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ textAlign: 'center' }}>
                        <HotelIcon color="primary" sx={{ fontSize: 40 }} />
                        <Typography variant="h6">{hotels.length}</Typography>
                        <Typography variant="body2" color="text.secondary">Hotels</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ textAlign: 'center' }}>
                        <RestaurantIcon color="primary" sx={{ fontSize: 40 }} />
                        <Typography variant="h6">{restaurants.length}</Typography>
                        <Typography variant="body2" color="text.secondary">Restaurants</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom color="primary">
                  Book Your Trip
                </Typography>
                <Typography variant="body1" paragraph>
                  Explore the amazing {destination.name} with our curated travel packages. 
                  Find the perfect accommodations and dining experiences.
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<BookOnlineIcon />}
                  onClick={handleBookNow}
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Tabs for Hotels and Restaurants */}
        <Box sx={{ width: '100%', mb: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              variant="fullWidth"
            >
              <Tab icon={<HotelIcon />} iconPosition="start" label="Hotels" />
              <Tab icon={<RestaurantIcon />} iconPosition="start" label="Restaurants" />
            </Tabs>
          </Box>
          
          {/* Hotels Tab */}
          <Box role="tabpanel" hidden={tabValue !== 0} sx={{ py: 3 }}>
            {hotels.length > 0 ? (
              <Grid container spacing={3}>
                {hotels.map(hotel => (
                  <Grid item key={hotel.id} xs={12} sm={6} md={4}>
                    <Card 
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'scale(1.02)' }
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="140"
                        image={hotel.imagePath ? `/${hotel.imagePath}` : `${process.env.PUBLIC_URL}/assets/sample2.jpg`}
                        alt={hotel.name}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h6" component="h3">
                          {hotel.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationOnIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                          <Typography variant="body2" color="text.secondary">
                            {hotel.location}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <AttachMoneyIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                          <Typography variant="body2" color="text.secondary">
                            ${hotel.pricePerNight} per night
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <BedroomParentIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                          <Typography variant="body2" color="text.secondary">
                            {hotel.address}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Alert severity="info">
                No hotels available for this destination yet.
              </Alert>
            )}
          </Box>
          
          {/* Restaurants Tab */}
          <Box role="tabpanel" hidden={tabValue !== 1} sx={{ py: 3 }}>
            {restaurants.length > 0 ? (
              <Grid container spacing={3}>
                {restaurants.map(restaurant => (
                  <Grid item key={restaurant.id} xs={12} sm={6} md={4}>
                    <Card 
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'scale(1.02)' }
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="140"
                        image={restaurant.imagePath ? `/${restaurant.imagePath}` : `${process.env.PUBLIC_URL}/assets/sample1.jpg`}
                        alt={restaurant.name}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h6" component="h3">
                          {restaurant.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationOnIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                          <Typography variant="body2" color="text.secondary">
                            {restaurant.location}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <DinnerDiningIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                          <Typography variant="body2" color="text.secondary">
                            {restaurant.cuisine} ({restaurant.cuisineType})
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOnIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                          <Typography variant="body2" color="text.secondary">
                            {restaurant.address}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Alert severity="info">
                No restaurants available for this destination yet.
              </Alert>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}