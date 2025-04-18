import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

export default function ContactUs() {
  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', my: 6, p: 3, background: '#fafafa', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>Contact Us</Typography>
      <TextField fullWidth label="Name" margin="normal" />
      <TextField fullWidth label="Email" margin="normal" />
      <TextField fullWidth label="Message" margin="normal" multiline rows={4} />
      <Button variant="contained" sx={{ mt: 2 }}>Send</Button>
    </Box>
  );
}