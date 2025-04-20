import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  TextField,
  Snackbar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function ViewDestinations() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    country: '',
    description: '',
    image: null
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    fetchDestinations();
  }, [user, navigate]);

  // Add more debug logging
  const fetchDestinations = async () => {
    try {
      setLoading(true);
      let response;
      try {
        response = await axios.get('/api/admin/destinations');
      } catch (initialError) {
        console.log("Error with regular endpoint, trying debug endpoint...");
        // If the main endpoint fails due to serialization issues, try the debug endpoint
        response = await axios.get('/api/admin/destinations/debug');
        // If using debug endpoint, extract the actual destinations array
        if (response.data && response.data.destinations) {
          response.data = response.data.destinations;
        }
      }
      
      // Ensure destinations is always an array
      setDestinations(Array.isArray(response.data) ? response.data : []);
      setError('');
    } catch (err) {
      console.error("Error fetching destinations:", err);
      setError('Failed to load destinations. Please try again later.');
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetails = (destination) => {
    setSelectedDestination(destination);
    setOpenDetailDialog(true);
  };

  const handleCloseDetails = () => {
    setOpenDetailDialog(false);
  };

  const handleOpenEdit = (destination) => {
    setSelectedDestination(destination);
    setEditForm({
      name: destination.name,
      country: destination.country,
      description: destination.description,
      image: null
    });
    setOpenEditDialog(true);
  };

  const handleCloseEdit = () => {
    setOpenEditDialog(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', editForm.name);
      formData.append('country', editForm.country);
      formData.append('description', editForm.description);
      if (editForm.image) {
        formData.append('image', editForm.image);
      }

      await axios.put(`/api/admin/destinations/${selectedDestination.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSnackbar({
        open: true,
        message: 'Destination updated successfully',
        severity: 'success'
      });
      handleCloseEdit();
      fetchDestinations();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data || 'Failed to update destination',
        severity: 'error'
      });
    }
  };

  const handleDeleteClick = (destination) => {
    setSelectedDestination(destination);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/admin/destinations/${selectedDestination.id}`);
      setDestinations(destinations.filter(d => d.id !== selectedDestination.id));
      setOpenDeleteDialog(false);
      setSnackbar({
        open: true,
        message: 'Destination deleted successfully',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to delete destination',
        severity: 'error'
      });
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

  return (
    <>
      <Navbar />
      <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, p: 2 }}>
        <Typography variant="h4" gutterBottom>
          Manage Destinations
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {Array.isArray(destinations) && destinations.length > 0 ? (
            destinations.map((destination) => (
              <Grid item xs={12} sm={6} md={4} key={destination.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleOpenDetails(destination)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={destination.imagePath || `${process.env.PUBLIC_URL}/assets/sample1.jpg`}
                    alt={destination.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {destination.name}
                    </Typography>
                    <Typography>
                      {destination.country}
                    </Typography>
                    <Typography color="textSecondary" noWrap>
                      {destination.description}
                    </Typography>
                  </CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                    <Button 
                      startIcon={<EditIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEdit(destination);
                      }}
                    >
                      Edit
                    </Button>
                    <Button 
                      color="error" 
                      startIcon={<DeleteIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(destination);
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1">No destinations available.</Typography>
            </Grid>
          )}
        </Grid>

        {/* Destination Detail Dialog */}
        <Dialog open={openDetailDialog} onClose={handleCloseDetails} maxWidth="md" fullWidth>
          {selectedDestination && (
            <>
              <DialogTitle>{selectedDestination.name}</DialogTitle>
              <DialogContent>
                <Box sx={{ mb: 2 }}>
                  <img
                    src={selectedDestination.imagePath || `${process.env.PUBLIC_URL}/assets/sample1.jpg`}
                    alt={selectedDestination.name}
                    style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
                  />
                </Box>
                <Typography variant="h6">Country</Typography>
                <Typography paragraph>{selectedDestination.country}</Typography>
                <Typography variant="h6">Description</Typography>
                <Typography paragraph>{selectedDestination.description}</Typography>
                {selectedDestination.hotels && selectedDestination.hotels.length > 0 && (
                  <>
                    <Typography variant="h6">Hotels</Typography>
                    {selectedDestination.hotels.map((hotel, index) => (
                      <Typography key={index} paragraph>• {hotel.name}</Typography>
                    ))}
                  </>
                )}
                {selectedDestination.restaurants && selectedDestination.restaurants.length > 0 && (
                  <>
                    <Typography variant="h6">Restaurants</Typography>
                    {selectedDestination.restaurants.map((restaurant, index) => (
                      <Typography key={index} paragraph>• {restaurant.name}</Typography>
                    ))}
                  </>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDetails}>Close</Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Edit Destination Dialog */}
        <Dialog open={openEditDialog} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Destination</DialogTitle>
          <form onSubmit={handleEditSubmit}>
            <DialogContent>
              <TextField
                fullWidth
                label="Destination Name"
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={editForm.country}
                onChange={handleEditChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
                margin="normal"
                required
                multiline
                rows={4}
              />
              <Box sx={{ mt: 2 }}>
                <input
                  accept="image/*"
                  type="file"
                  onChange={(e) => setEditForm(prev => ({ ...prev, image: e.target.files[0] }))}
                  style={{ display: 'none' }}
                  id="destination-image-edit"
                />
                <label htmlFor="destination-image-edit">
                  <Button variant="outlined" component="span">
                    Upload New Image
                  </Button>
                </label>
                {editForm.image && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Selected file: {editForm.image.name}
                  </Typography>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEdit}>Cancel</Button>
              <Button type="submit" variant="contained">Save Changes</Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the destination: 
              {selectedDestination && <strong> {selectedDestination.name}</strong>}?
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
            severity={snackbar.severity}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}