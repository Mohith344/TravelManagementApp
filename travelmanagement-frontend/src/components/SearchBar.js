import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
      <TextField
        label="Search Destinations"
        variant="outlined"
        value={query}
        onChange={e => setQuery(e.target.value)}
        sx={{ mr: 2, width: 400 }}
      />
      <Button variant="contained" onClick={() => onSearch(query)}>Search</Button>
    </Box>
  );
}