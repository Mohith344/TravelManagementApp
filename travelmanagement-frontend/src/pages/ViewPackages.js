import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar';
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
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function ViewPackages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [packageImages, setPackageImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    fetchPackages();
  }, [user, navigate]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/travel-packages/user/${user.username}`);
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

  const handleEditPackage = (packageId) => {
    // Navigate to edit package page with the package ID
    navigate(`/edit-package/${packageId}`);
  };

  const handleDeleteClick = (pkg) => {
    setSelectedPackage(pkg);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/travel-packages/${selectedPackage.id}`);
      setPackages(packages.filter(pkg => pkg.id !== selectedPackage.id));
      setOpenDeleteDialog(false);
      setSnackbar({
        open: true,
        message: 'Package deleted successfully',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error deleting package:', err);
      setSnackbar({
        open: true,
        message: 'Failed to delete package',
        severity: 'error'
      });
    }
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
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
          My Travel Packages
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {packages.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6">
              You haven't created any packages yet.
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => navigate('/create-package')}
            >
              Create Your First Package
            </Button>
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
                  </CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                    <Button 
                      size="small" 
                      startIcon={<EditIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditPackage(pkg.id);
                      }}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="small" 
                      color="error" 
                      startIcon={<DeleteIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(pkg);
                      }}
                    >
                      Delete
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
              <DialogTitle>{selectedPackage.name}</DialogTitle>
              <DialogContent>
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

                <Typography variant="h6" sx={{ mt: 2 }}>
                  Price: ${selectedPackage.price}
                </Typography>

                <Typography variant="body1" sx={{ mt: 1 }}>
                  {selectedPackage.description}
                </Typography>

                <Typography variant="h6" sx={{ mt: 2 }}>
                  Hotels
                </Typography>
                <Divider sx={{ mb: 1 }} />
                {selectedPackage.hotels && selectedPackage.hotels.length > 0 ? (
                  selectedPackage.hotels.map((hotel, index) => (
                    <Typography key={index} variant="body2" gutterBottom>
                      • {hotel.name} - {hotel.location || ''}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2">No hotels specified</Typography>
                )}

                <Typography variant="h6" sx={{ mt: 2 }}>
                  Restaurants
                </Typography>
                <Divider sx={{ mb: 1 }} />
                {selectedPackage.restaurants && selectedPackage.restaurants.length > 0 ? (
                  selectedPackage.restaurants.map((restaurant, index) => (
                    <Typography key={index} variant="body2" gutterBottom>
                      • {restaurant.name} - {restaurant.cuisine || ''}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2">No restaurants specified</Typography>
                )}

                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Agency: {selectedPackage.travelAgencyName}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDetails}>Close</Button>
                <Button 
                  color="primary" 
                  startIcon={<EditIcon />} 
                  onClick={() => {
                    handleCloseDetails();
                    handleEditPackage(selectedPackage.id);
                  }}
                >
                  Edit Package
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the package: 
              {selectedPackage && <strong> {selectedPackage.name}</strong>}?
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

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