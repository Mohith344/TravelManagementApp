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

export default function ViewRestaurants() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    location: '',
    address: '',
    cuisine: '',
    cuisineType: '',
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
    fetchRestaurants();
  }, [user, navigate]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/restaurants');
      setRestaurants(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load restaurants. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetails = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setOpenDetailDialog(true);
  };

  const handleCloseDetails = () => {
    setOpenDetailDialog(false);
  };

  const handleOpenEdit = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setEditForm({
      name: restaurant.name,
      location: restaurant.location,
      address: restaurant.address,
      cuisine: restaurant.cuisine,
      cuisineType: restaurant.cuisineType,
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
      formData.append('location', editForm.location);
      formData.append('address', editForm.address);
      formData.append('cuisine', editForm.cuisine);
      formData.append('cuisineType', editForm.cuisineType);
      if (editForm.image) {
        formData.append('image', editForm.image);
      }

      await axios.put(`/api/admin/restaurants/${selectedRestaurant.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSnackbar({
        open: true,
        message: 'Restaurant updated successfully',
        severity: 'success'
      });
      handleCloseEdit();
      fetchRestaurants();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data || 'Failed to update restaurant',
        severity: 'error'
      });
    }
  };

  const handleDeleteClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/admin/restaurants/${selectedRestaurant.id}`);
      setRestaurants(restaurants.filter(r => r.id !== selectedRestaurant.id));
      setOpenDeleteDialog(false);
      setSnackbar({
        open: true,
        message: 'Restaurant deleted successfully',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to delete restaurant',
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
          Manage Restaurants
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {restaurants.map((restaurant) => (
            <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer'
                }}
                onClick={() => handleOpenDetails(restaurant)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={restaurant.imagePath || `${process.env.PUBLIC_URL}/assets/sample1.jpg`}
                  alt={restaurant.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {restaurant.name}
                  </Typography>
                  <Typography>
                    {restaurant.location}
                  </Typography>
                  <Typography color="textSecondary">
                    {restaurant.cuisine} • {restaurant.cuisineType}
                  </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                  <Button 
                    startIcon={<EditIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEdit(restaurant);
                    }}
                  >
                    Edit
                  </Button>
                  <Button 
                    color="error" 
                    startIcon={<DeleteIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(restaurant);
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Restaurant Detail Dialog */}
        <Dialog open={openDetailDialog} onClose={handleCloseDetails} maxWidth="md" fullWidth>
          {selectedRestaurant && (
            <>
              <DialogTitle>{selectedRestaurant.name}</DialogTitle>
              <DialogContent>
                <Box sx={{ mb: 2 }}>
                  <img
                    src={selectedRestaurant.imagePath || `${process.env.PUBLIC_URL}/assets/sample1.jpg`}
                    alt={selectedRestaurant.name}
                    style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
                  />
                </Box>
                <Typography variant="h6">Location</Typography>
                <Typography paragraph>{selectedRestaurant.location}</Typography>
                <Typography variant="h6">Cuisine</Typography>
                <Typography paragraph>{selectedRestaurant.cuisine} • {selectedRestaurant.cuisineType}</Typography>
                <Typography variant="h6">Address</Typography>
                <Typography paragraph>{selectedRestaurant.address}</Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDetails}>Close</Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Edit Restaurant Dialog */}
        <Dialog open={openEditDialog} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Restaurant</DialogTitle>
          <form onSubmit={handleEditSubmit}>
            <DialogContent>
              <TextField
                fullWidth
                label="Restaurant Name"
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={editForm.location}
                onChange={handleEditChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={editForm.address}
                onChange={handleEditChange}
                margin="normal"
                required
                multiline
                rows={2}
              />
              <TextField
                fullWidth
                label="Cuisine"
                name="cuisine"
                value={editForm.cuisine}
                onChange={handleEditChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Cuisine Type"
                name="cuisineType"
                value={editForm.cuisineType}
                onChange={handleEditChange}
                margin="normal"
                required
              />
              <Box sx={{ mt: 2 }}>
                <input
                  accept="image/*"
                  type="file"
                  onChange={(e) => setEditForm(prev => ({ ...prev, image: e.target.files[0] }))}
                  style={{ display: 'none' }}
                  id="restaurant-image-edit"
                />
                <label htmlFor="restaurant-image-edit">
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
              Are you sure you want to delete the restaurant: 
              {selectedRestaurant && <strong> {selectedRestaurant.name}</strong>}?
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