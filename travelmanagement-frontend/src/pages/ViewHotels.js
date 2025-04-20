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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function ViewHotels() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    location: '',
    pricePerNight: '',
    address: '',
    destinationId: '',
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
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [hotelsResponse, destinationsResponse] = await Promise.all([
        axios.get('/api/admin/hotels'),
        axios.get('/api/admin/destinations')
      ]);
      setHotels(Array.isArray(hotelsResponse.data) ? hotelsResponse.data : []);
      setDestinations(Array.isArray(destinationsResponse.data) ? destinationsResponse.data : []);
      setError('');
    } catch (err) {
      console.error("Error fetching data:", err);
      setError('Failed to load data. Please try again later.');
      setHotels([]);
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetails = (hotel) => {
    setSelectedHotel(hotel);
    setOpenDetailDialog(true);
  };

  const handleCloseDetails = () => {
    setOpenDetailDialog(false);
  };

  const handleOpenEdit = (hotel) => {
    setSelectedHotel(hotel);
    setEditForm({
      name: hotel.name,
      location: hotel.location,
      pricePerNight: hotel.pricePerNight,
      address: hotel.address,
      destinationId: hotel.destination?.id || '',
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
      formData.append('pricePerNight', editForm.pricePerNight);
      formData.append('address', editForm.address);
      if (editForm.destinationId) {
        formData.append('destinationId', editForm.destinationId);
      }
      if (editForm.image) {
        formData.append('image', editForm.image);
      }

      await axios.put(`/api/admin/hotels/${selectedHotel.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSnackbar({
        open: true,
        message: 'Hotel updated successfully',
        severity: 'success'
      });
      handleCloseEdit();
      fetchData();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data || 'Failed to update hotel',
        severity: 'error'
      });
    }
  };

  const handleDeleteClick = (hotel) => {
    setSelectedHotel(hotel);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/admin/hotels/${selectedHotel.id}`);
      setHotels(hotels.filter(h => h.id !== selectedHotel.id));
      setOpenDeleteDialog(false);
      setSnackbar({
        open: true,
        message: 'Hotel deleted successfully',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to delete hotel',
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
          Manage Hotels
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {Array.isArray(hotels) && hotels.length > 0 ? (
            hotels.map((hotel) => (
              <Grid item xs={12} sm={6} md={4} key={hotel.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleOpenDetails(hotel)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={hotel.imagePath || `${process.env.PUBLIC_URL}/assets/sample1.jpg`}
                    alt={hotel.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {hotel.name}
                    </Typography>
                    <Typography>
                      {hotel.location}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ${hotel.pricePerNight}/night
                    </Typography>
                    {hotel.destination && (
                      <Typography color="textSecondary">
                        {hotel.destination.name}, {hotel.destination.country}
                      </Typography>
                    )}
                  </CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                    <Button 
                      startIcon={<EditIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEdit(hotel);
                      }}
                    >
                      Edit
                    </Button>
                    <Button 
                      color="error" 
                      startIcon={<DeleteIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(hotel);
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="body1">No hotels available.</Typography>
          )}
        </Grid>

        {/* Hotel Detail Dialog */}
        <Dialog open={openDetailDialog} onClose={handleCloseDetails} maxWidth="md" fullWidth>
          {selectedHotel && (
            <>
              <DialogTitle>{selectedHotel.name}</DialogTitle>
              <DialogContent>
                <Box sx={{ mb: 2 }}>
                  <img
                    src={selectedHotel.imagePath || `${process.env.PUBLIC_URL}/assets/sample1.jpg`}
                    alt={selectedHotel.name}
                    style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
                  />
                </Box>
                <Typography variant="h6">Location</Typography>
                <Typography paragraph>{selectedHotel.location}</Typography>
                <Typography variant="h6">Price Per Night</Typography>
                <Typography paragraph>${selectedHotel.pricePerNight}</Typography>
                <Typography variant="h6">Address</Typography>
                <Typography paragraph>{selectedHotel.address}</Typography>
                {selectedHotel.destination && (
                  <>
                    <Typography variant="h6">Destination</Typography>
                    <Typography paragraph>
                      {selectedHotel.destination.name}, {selectedHotel.destination.country}
                    </Typography>
                  </>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDetails}>Close</Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Edit Hotel Dialog */}
        <Dialog open={openEditDialog} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Hotel</DialogTitle>
          <form onSubmit={handleEditSubmit}>
            <DialogContent>
              <TextField
                fullWidth
                label="Hotel Name"
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
                label="Price Per Night"
                name="pricePerNight"
                value={editForm.pricePerNight}
                onChange={handleEditChange}
                margin="normal"
                required
                type="number"
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
              <FormControl fullWidth margin="normal">
                <InputLabel>Destination</InputLabel>
                <Select
                  name="destinationId"
                  value={editForm.destinationId}
                  onChange={handleEditChange}
                  label="Destination"
                >
                  {Array.isArray(destinations) && destinations.length > 0 ? (
                    destinations.map((dest) => (
                      <MenuItem key={dest.id} value={dest.id}>
                        {dest.name}, {dest.country}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No destinations available</MenuItem>
                  )}
                </Select>
              </FormControl>
              <Box sx={{ mt: 2 }}>
                <input
                  accept="image/*"
                  type="file"
                  onChange={(e) => setEditForm(prev => ({ ...prev, image: e.target.files[0] }))}
                  style={{ display: 'none' }}
                  id="hotel-image-edit"
                />
                <label htmlFor="hotel-image-edit">
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
              Are you sure you want to delete the hotel: 
              {selectedHotel && <strong> {selectedHotel.name}</strong>}?
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