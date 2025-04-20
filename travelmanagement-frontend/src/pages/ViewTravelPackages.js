import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  CardMedia,
  Typography, 
  Button, 
  Grid, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HotelIcon from '@mui/icons-material/Hotel';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BusinessIcon from '@mui/icons-material/Business';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function ViewTravelPackages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [packageImages, setPackageImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      // Fetch all packages using the new endpoint
      const response = await axios.get('/api/bookings/packages');
      setPackages(response.data);
      
      // Fetch images for each package
      const imagePromises = response.data.map(pkg => 
        Promise.all([
          axios.get(`/images/by-type/restaurant/${pkg.id}`).catch(() => ({ data: [] })),
          axios.get(`/images/by-type/hotel/${pkg.id}`).catch(() => ({ data: [] }))
        ])
      );
      
      const imagesResults = await Promise.all(imagePromises);
      
      // Create an object that maps package IDs to their images
      const imageMap = {};
      response.data.forEach((pkg, index) => {
        imageMap[pkg.id] = {
          restaurantImages: imagesResults[index][0].data || [],
          hotelImages: imagesResults[index][1].data || []
        };
      });
      
      setPackageImages(imageMap);
      setError('');
    } catch (err) {
      console.error('Error fetching packages:', err);
      setError('Failed to load travel packages. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Get package cover image (first image from restaurant or hotel images)
  const getPackageCoverImage = (packageId) => {
    const images = packageImages[packageId];
    if (!images) return `${process.env.PUBLIC_URL}/assets/sample1.jpg`;
    
    if (images.restaurantImages && images.restaurantImages.length > 0) {
      return images.restaurantImages[0];
    }
    
    if (images.hotelImages && images.hotelImages.length > 0) {
      return images.hotelImages[0];
    }
    
    return `${process.env.PUBLIC_URL}/assets/sample1.jpg`;
  };

  const handleOpenDetails = (pkg) => {
    setSelectedPackage(pkg);
    setOpenDetailDialog(true);
  };

  const handleCloseDetails = () => {
    setOpenDetailDialog(false);
  };

  const handleBookNow = (packageId) => {
    if (!user) {
      // If user is not logged in, redirect to login page with redirect path
      navigate('/login', { state: { from: `/book-package/${packageId}` } });
    } else if (user.role !== 'TRAVELLER' && user.role !== 'ROLE_TRAVELLER') {
      // Show an error message that only travelers can book
      setSnackbar({
        open: true,
        message: 'Only travelers can book packages. Please register as a traveler.',
        severity: 'error'
      });
    } else {
      // User is a traveler, navigate to booking page
      navigate(`/book-package/${packageId}`);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
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
      <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Available Travel Packages
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {packages.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6">
              No travel packages available at the moment.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {packages.map((pkg) => (
              <Grid item xs={12} sm={6} md={4} key={pkg.id}>
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
                    image={getPackageCoverImage(pkg.id)}
                    alt={pkg.name}
                    sx={{ cursor: 'pointer', objectFit: 'cover' }}
                    onClick={() => handleOpenDetails(pkg)}
                  />
                  <CardContent sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => handleOpenDetails(pkg)}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {pkg.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {pkg.description}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                      ${pkg.price}
                    </Typography>
                    <Box sx={{ display: 'flex', mt: 1, gap: 1 }}>
                      <Chip 
                        icon={<HotelIcon />} 
                        label={`${pkg.hotelCount} Hotels`} 
                        size="small" 
                        variant="outlined" 
                      />
                      <Chip 
                        icon={<RestaurantIcon />} 
                        label={`${pkg.restaurantCount} Restaurants`} 
                        size="small" 
                        variant="outlined" 
                      />
                    </Box>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button 
                      variant="contained" 
                      fullWidth
                      onClick={() => handleBookNow(pkg.id)}
                    >
                      Book Now
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Package Detail Dialog */}
        <Dialog 
          open={openDetailDialog} 
          onClose={handleCloseDetails}
          maxWidth="md"
          fullWidth
        >
          {selectedPackage && (
            <>
              <DialogTitle>
                <Typography variant="h5">{selectedPackage.name}</Typography>
              </DialogTitle>
              <DialogContent>
                {/* Images Carousel */}
                <Carousel showThumbs={false} infiniteLoop showStatus={false}>
                  {packageImages[selectedPackage.id]?.restaurantImages?.map((image, index) => (
                    <div key={`restaurant-${index}`}>
                      <img
                        src={image}
                        alt={`Restaurant ${index + 1}`}
                        style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'cover' }}
                      />
                      <p className="legend">Restaurant Image</p>
                    </div>
                  ))}
                  
                  {packageImages[selectedPackage.id]?.hotelImages?.map((image, index) => (
                    <div key={`hotel-${index}`}>
                      <img
                        src={image}
                        alt={`Hotel ${index + 1}`}
                        style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'cover' }}
                      />
                      <p className="legend">Hotel Image</p>
                    </div>
                  ))}
                  
                  {(!packageImages[selectedPackage.id]?.restaurantImages?.length && 
                   !packageImages[selectedPackage.id]?.hotelImages?.length) && (
                    <div>
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/sample1.jpg`}
                        alt="Default Package"
                        style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                </Carousel>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
                  <Typography variant="h6">
                    Price: ${selectedPackage.price}
                  </Typography>
                  <Chip 
                    icon={<BusinessIcon />} 
                    label={`By: ${selectedPackage.travelAgencyName}`}
                    color="primary"
                    variant="outlined"
                  />
                </Box>

                <Typography variant="body1" paragraph>
                  {selectedPackage.description}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6">
                      Hotels ({selectedPackage.hotelCount})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedPackage.hotelCount > 0 
                        ? 'This package includes comfortable hotel accommodations.' 
                        : 'No hotels specified for this package'
                      }
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6">
                      Restaurants ({selectedPackage.restaurantCount})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedPackage.restaurantCount > 0 
                        ? 'Enjoy delicious meals at selected restaurants.' 
                        : 'No restaurants specified for this package'
                      }
                    </Typography>
                  </Grid>
                </Grid>

              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDetails}>Close</Button>
                <Button 
                  variant="contained" 
                  onClick={() => {
                    handleCloseDetails();
                    handleBookNow(selectedPackage.id);
                  }}
                >
                  Book This Package
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={6000} 
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}