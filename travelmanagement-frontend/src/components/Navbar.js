// src/components/Navbar.js
import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import HotelIcon from '@mui/icons-material/Hotel';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LuggageIcon from '@mui/icons-material/Luggage';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import ViewListIcon from '@mui/icons-material/ViewList';
import ExploreIcon from '@mui/icons-material/Explore';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

export default function Navbar({ onLoginClick, onRegisterClick }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [adminMenuAnchor, setAdminMenuAnchor] = useState(null);
  const [travelerMenuAnchor, setTravelerMenuAnchor] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAdminMenuClick = (event) => {
    setAdminMenuAnchor(event.currentTarget);
  };

  const handleTravelerMenuClick = (event) => {
    setTravelerMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAdminMenuClose = () => {
    setAdminMenuAnchor(null);
  };

  const handleTravelerMenuClose = () => {
    setTravelerMenuAnchor(null);
  };

  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'ROLE_ADMIN');
  const isAgency = user && (user.role === 'TRAVEL_AGENCY' || user.role === 'ROLE_TRAVEL_AGENCY');
  const isTraveler = user && (user.role === 'TRAVELLER' || user.role === 'ROLE_TRAVELLER');

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Travel Management
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        
        {/* Travel Packages - Visible to all */}
        <Button 
          color="inherit" 
          component={Link} 
          to="/view-travel-packages"
          startIcon={<ExploreIcon />}
        >
          Travel Packages
        </Button>

        {/* Admin Menu */}
        {isAdmin && (
          <>
            <Button 
              color="inherit" 
              onClick={handleAdminMenuClick}
              startIcon={<MenuIcon />}
            >
              Admin
            </Button>
            <Menu
              anchorEl={adminMenuAnchor}
              open={Boolean(adminMenuAnchor)}
              onClose={handleAdminMenuClose}
            >
              <MenuItem component={Link} to="/add-destination" onClick={handleAdminMenuClose}>
                <ListItemIcon>
                  <LocationOnIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Add Destination</ListItemText>
              </MenuItem>
              <MenuItem component={Link} to="/view-destinations" onClick={handleAdminMenuClose}>
                <ListItemIcon>
                  <LocationOnIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>View Destinations</ListItemText>
              </MenuItem>
              <MenuItem component={Link} to="/add-hotel" onClick={handleAdminMenuClose}>
                <ListItemIcon>
                  <HotelIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Add Hotel</ListItemText>
              </MenuItem>
              <MenuItem component={Link} to="/view-hotels" onClick={handleAdminMenuClose}>
                <ListItemIcon>
                  <HotelIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>View Hotels</ListItemText>
              </MenuItem>
              <MenuItem component={Link} to="/add-restaurant" onClick={handleAdminMenuClose}>
                <ListItemIcon>
                  <RestaurantIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Add Restaurant</ListItemText>
              </MenuItem>
              <MenuItem component={Link} to="/view-restaurants" onClick={handleAdminMenuClose}>
                <ListItemIcon>
                  <RestaurantIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>View Restaurants</ListItemText>
              </MenuItem>
              <MenuItem component={Link} to="/manage-complaints" onClick={handleAdminMenuClose}>
                <ListItemIcon>
                  <ReportProblemIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Manage Complaints</ListItemText>
              </MenuItem>
            </Menu>
          </>
        )}

        {/* Travel Agency Menu */}
        {isAgency && (
          <>
            <Button 
              color="inherit" 
              component={Link} 
              to="/create-package"
              startIcon={<LuggageIcon />}
            >
              Create Package
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              to="/view-packages"
              startIcon={<ViewListIcon />}
            >
              My Packages
            </Button>
          </>
        )}

        {/* Traveler Menu */}
        {isTraveler && (
          <>
            <Button 
              color="inherit" 
              onClick={handleTravelerMenuClick}
              startIcon={<MenuIcon />}
            >
              My Travel
            </Button>
            <Menu
              anchorEl={travelerMenuAnchor}
              open={Boolean(travelerMenuAnchor)}
              onClose={handleTravelerMenuClose}
            >
              <MenuItem component={Link} to="/view-travel-packages" onClick={handleTravelerMenuClose}>
                <ListItemIcon>
                  <ExploreIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Browse Packages</ListItemText>
              </MenuItem>
              <MenuItem component={Link} to="/my-bookings" onClick={handleTravelerMenuClose}>
                <ListItemIcon>
                  <BookOnlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>My Bookings</ListItemText>
              </MenuItem>
              <MenuItem component={Link} to="/my-complaints" onClick={handleTravelerMenuClose}>
                <ListItemIcon>
                  <FeedbackIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>My Complaints</ListItemText>
              </MenuItem>
            </Menu>
          </>
        )}

        {!user ? (
          <>
            {isHomePage ? (
              <>
                <Button color="inherit" onClick={onLoginClick}>Login</Button>
                <Button color="inherit" onClick={onRegisterClick}>Register</Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">Login</Button>
                <Button color="inherit" component={Link} to="/register">Register</Button>
              </>
            )}
          </>
        ) : (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button color="inherit" startIcon={<AccountCircleIcon />}>
                {user.username}
              </Button>
              <Button color="inherit" onClick={logout}>Logout</Button>
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
