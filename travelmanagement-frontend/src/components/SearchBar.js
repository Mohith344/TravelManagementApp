import React, { useState } from 'react';
import { TextField, Button, Box, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search-results?q=${encodeURIComponent(query)}`);
      if (onSearch) {
        onSearch(query);
      }
    }
  };
  
  return (
    <Box 
      component="form" 
      onSubmit={handleSearch} 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        my: 2, 
        px: 2,
        maxWidth: 600,
        mx: 'auto'
      }}
    >
      <TextField
        label="Search Destinations"
        variant="outlined"
        value={query}
        onChange={e => setQuery(e.target.value)}
        sx={{ width: '100%', mr: 1 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        placeholder="Search by name, country or description"
      />
      <Button 
        variant="contained" 
        type="submit" 
        sx={{ px: 3 }}
      >
        Search
      </Button>
    </Box>
  );
}