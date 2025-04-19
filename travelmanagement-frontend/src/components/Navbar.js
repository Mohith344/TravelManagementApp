// src/components/Navbar.js
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function Navbar({ onLoginClick, onRegisterClick }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Travel Management
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/packages">Packages</Button>
        <Button color="inherit" component={Link} to="/agencies">Agencies</Button>

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
            <Button color="inherit" startIcon={<AccountCircleIcon />} component={Link} to="/account">
              {user.username}
            </Button>
            <Button color="inherit" onClick={logout}>Logout</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
