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
  Chip,
  Tabs,
  Tab
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import HotelIcon from '@mui/icons-material/Hotel';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LuggageIcon from '@mui/icons-material/Luggage';
import { useAuth } from '../context/AuthContext';

export default function SearchResults() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('q') || '';
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [travelPackages, setTravelPackages] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  
  useEffect(() => {
    if (query) {
      searchAll(query);
    }
  }, [query]);
  
  const searchAll = async (searchQuery) => {
    try {
      setLoading(true);
      setError('');
      // Use the new combined search endpoint
      const response = await axios.get(`/api/admin/search?query=${encodeURIComponent(searchQuery)}`);
      
      if (response.data && response.data.destinations) {
        setDestinations(response.data.destinations || []);
      }
      
      if (response.data && response.data.packages) {
        setTravelPackages(response.data.packages || []);
      }
    } catch (err) {
      console.error('Search failed:', err);
      setError('Failed to perform search. Please try again later.');
      setDestinations([]);
      setTravelPackages([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewDetails = (item) => {
    if (item.type === 'destination') {
      navigate(`/destination-details/${item.id}`);
    } else if (item.type === 'package') {
      navigate(`/package-details/${item.id}`);
    }
  };
  
  const handleBookNow = (item) => {
    if (!user) {
      // If user is not logged in, redirect to login page
      const targetPath = item.type === 'destination' 
        ? `/destination-details/${item.id}`
        : `/package-details/${item.id}`;
      navigate('/login', { state: { from: targetPath } });
    } else if (user.role !== 'TRAVELLER') {
      // Non-traveler users get redirected to the appropriate page where they'll see access denied
      if (item.type === 'destination') {
        navigate(`/book-destination/${item.id}`);
      } else {
        navigate(`/book-package/${item.id}`);
      }
    } else {
      // Travelers go directly to the booking page
      if (item.type === 'destination') {
        navigate(`/book-destination/${item.id}`);
      } else {
        navigate(`/book-package/${item.id}`);
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const totalResults = destinations.length + travelPackages.length;
  
  return (
    <>
      <Navbar />
      <Box sx={{ py: 3, px: 2 }}>
        <SearchBar onSearch={searchAll} initialValue={query} />
        
        <Typography variant="h4" component="h1" sx={{ mt: 3, mb: 1 }}>
          Search Results for "{query}"
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {totalResults} results found
        </Typography>
        
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label={`All (${totalResults})`} />
          <Tab label={`Destinations (${destinations.length})`} />
          <Tab label={`Travel Packages (${travelPackages.length})`} />
        </Tabs>
        
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}
        
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        {!loading && totalResults === 0 && !error && (
          <Alert severity="info" sx={{ mb: 3 }}>
            No results found matching "{query}". Try searching with different keywords.
          </Alert>
        )}
        
        <Grid container spacing={3}>
          {/* Show destinations if on All tab or Destinations tab */}
          {(activeTab === 0 || activeTab === 1) && destinations.map((destination) => (
            <Grid item key={`dest-${destination.id}`} xs={12} sm={6} md={4} lg={3}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.03)' },
                  boxShadow: 2
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={destination.imagePath ? `/${destination.imagePath}` : `${process.env.PUBLIC_URL}/assets/sample1.jpg`}
                  alt={destination.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {destination.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOnIcon fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {destination.country}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {destination.description?.substring(0, 100)}
                    {destination.description?.length > 100 ? '...' : ''}
                  </Typography>
                  
                  <Divider sx={{ my: 1.5 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Chip 
                      icon={<HotelIcon />} 
                      label={`${destination.hotelCount} Hotels`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip 
                      icon={<RestaurantIcon />} 
                      label={`${destination.restaurantCount} Restaurants`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
                <Box sx={{ p: 2, pt: 0, mt: 'auto' }}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Button 
                        variant="outlined" 
                        fullWidth
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewDetails(destination)}
                      >
                        View
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button 
                        variant="contained" 
                        color="primary"
                        fullWidth
                        startIcon={<BookOnlineIcon />}
                        onClick={() => handleBookNow(destination)}
                      >
                        Book
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Card>
            </Grid>
          ))}
          
          {/* Show travel packages if on All tab or Packages tab */}
          {(activeTab === 0 || activeTab === 2) && travelPackages.map((travelPackage) => (
            <Grid item key={`pkg-${travelPackage.id}`} xs={12} sm={6} md={4} lg={3}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.03)' },
                  boxShadow: 2
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={travelPackage.imagePath ? `/${travelPackage.imagePath}` : `${process.env.PUBLIC_URL}/assets/sample2.jpg`}
                  alt={travelPackage.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2" sx={{ mb: 0 }}>
                      {travelPackage.name}
                    </Typography>
                    <Chip
                      icon={<AttachMoneyIcon />}
                      label={`$${travelPackage.price}`}
                      color="primary"
                      size="small"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LuggageIcon fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {travelPackage.travelAgencyName || 'Travel Agency'}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {travelPackage.description?.substring(0, 100)}
                    {travelPackage.description?.length > 100 ? '...' : ''}
                  </Typography>
                  
                  <Divider sx={{ my: 1.5 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Chip 
                      icon={<HotelIcon />} 
                      label={`${travelPackage.hotelCount} Hotels`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip 
                      icon={<RestaurantIcon />} 
                      label={`${travelPackage.restaurantCount} Restaurants`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
                <Box sx={{ p: 2, pt: 0, mt: 'auto' }}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Button 
                        variant="outlined" 
                        fullWidth
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewDetails(travelPackage)}
                      >
                        View
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button 
                        variant="contained" 
                        color="primary"
                        fullWidth
                        startIcon={<BookOnlineIcon />}
                        onClick={() => handleBookNow(travelPackage)}
                      >
                        Book
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}