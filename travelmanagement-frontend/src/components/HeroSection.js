import React from 'react';
import { Box, Typography, Button } from '@mui/material';

export default function HeroSection() {
  return (
    <Box sx={{ textAlign: 'center', py: 6, background: '#f5f5f5' }}>
      <Typography variant="h3" gutterBottom>
        Explore the World with Us!
      </Typography>
      <Typography variant="h6" gutterBottom>
        Book your next adventure with the best travel packages and agencies.
      </Typography>
      <Button variant="contained" size="large" href="/packages">
        View Packages
      </Button>
    </Box>
  );
}