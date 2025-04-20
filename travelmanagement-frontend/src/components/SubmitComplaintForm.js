import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Select,
  InputLabel,
  Alert,
  CircularProgress,
  Typography
} from '@mui/material';
import axios from 'axios';

export default function SubmitComplaintForm({ userId, username, onSuccess, onClose }) {
  const [form, setForm] = useState({
    subject: '',
    description: '',
    complaintType: 'RESTAURANT',
    entityId: '',
    entityName: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [options, setOptions] = useState({
    restaurants: [],
    packages: [],
    agencies: []
  });
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      setLoadingOptions(true);
      
      // Fetch options for complaints - use correct endpoints
      const [restaurantsRes, packagesRes, agenciesRes] = await Promise.all([
        axios.get('/api/admin/restaurants'),
        axios.get('/travel-packages'),
        axios.get('/users/agencies') // This should be the correct endpoint for agencies
      ]);
      
      console.log('Fetched restaurant options:', restaurantsRes.data);
      console.log('Fetched package options:', packagesRes.data);
      console.log('Fetched agency options:', agenciesRes.data);
      
      setOptions({
        restaurants: restaurantsRes.data || [],
        packages: packagesRes.data || [],
        agencies: agenciesRes.data || []
      });
    } catch (err) {
      console.error('Error fetching options:', err);
      // Set empty lists if API calls fail
      setOptions({
        restaurants: [],
        packages: [],
        agencies: []
      });
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'complaintType') {
      // Reset entity selection when type changes
      setForm({
        ...form,
        [name]: value,
        entityId: '',
        entityName: ''
      });
    } else if (name === 'entityId') {
      let entityName = '';
      
      if (value) {
        // When selecting an entity, find its name from the appropriate list
        if (form.complaintType === 'RESTAURANT') {
          const restaurant = options.restaurants.find(r => r.id === Number(value) || r.id === value);
          entityName = restaurant ? restaurant.name : '';
        } else if (form.complaintType === 'TRAVEL_PACKAGE') {
          const pkg = options.packages.find(p => p.id === Number(value) || p.id === value);
          entityName = pkg ? pkg.name : '';
        } else if (form.complaintType === 'TRAVEL_AGENCY') {
          const agency = options.agencies.find(a => a.id === Number(value) || a.id === value);
          entityName = agency ? (agency.travelAgencyName || agency.username) : '';
        }
      }
      
      setForm({
        ...form,
        entityId: value,
        entityName: entityName
      });
    } else {
      // For other fields (subject, description)
      setForm({
        ...form,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!form.subject || !form.description) {
      setError('Please fill out all required fields');
      return;
    }
    
    if ((form.complaintType === 'RESTAURANT' || form.complaintType === 'TRAVEL_PACKAGE') && !form.entityId) {
      setError(`Please select a ${form.complaintType === 'RESTAURANT' ? 'restaurant' : 'travel package'}`);
      return;
    }
    
    if (form.complaintType === 'TRAVEL_AGENCY' && !form.entityName) {
      setError('Please select a travel agency');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Format the payload based on complaint type
      const payload = {
        subject: form.subject,
        description: form.description,
        complaintType: form.complaintType,
        // Add username to the request body as well for backup
        username: username
      };
      
      // Add the right ID or name based on complaint type
      if (form.complaintType === 'RESTAURANT' || form.complaintType === 'TRAVEL_PACKAGE') {
        payload.entityId = Number(form.entityId); // Convert to number
      } else if (form.complaintType === 'TRAVEL_AGENCY') {
        payload.entityName = form.entityName;
      }
      
      console.log('Sending complaint payload:', payload);
      
      // Include username as both query param and in request body for redundancy
      await axios.post(`/api/complaints?username=${username}`, payload);
      
      setSuccess(true);
      if (onSuccess) onSuccess();
      
      // Reset form
      setForm({
        subject: '',
        description: '',
        complaintType: 'RESTAURANT',
        entityId: '',
        entityName: ''
      });
      
      // Close the form after a short delay (if provided)
      setTimeout(() => {
        if (onClose) onClose();
      }, 1500);
      
    } catch (err) {
      console.error('Error submitting complaint:', err);
      setError(err.response?.data || 'Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderEntityOptions = () => {
    const type = form.complaintType;
    let entityOptions = [];
    let label = '';
    
    if (type === 'RESTAURANT') {
      entityOptions = options.restaurants;
      label = 'Select Restaurant';
    } else if (type === 'TRAVEL_PACKAGE') {
      entityOptions = options.packages;
      label = 'Select Travel Package';
    } else if (type === 'TRAVEL_AGENCY') {
      entityOptions = options.agencies;
      label = 'Select Travel Agency';
    }
    
    if (loadingOptions) {
      return (
        <FormControl fullWidth margin="normal" required>
          <InputLabel>{label}</InputLabel>
          <Select
            disabled
            value=""
            label={label}
          >
            <MenuItem value="">
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Loading...
            </MenuItem>
          </Select>
        </FormControl>
      );
    }
    
    return (
      <FormControl fullWidth margin="normal" required>
        <InputLabel>{label}</InputLabel>
        <Select
          name="entityId"
          value={form.entityId}
          onChange={handleChange}
          label={label}
        >
          {entityOptions.length > 0 ? (
            entityOptions.map(entity => (
              <MenuItem key={entity.id} value={entity.id}>
                {entity.name || entity.travelAgencyName || entity.username}
              </MenuItem>
            ))
          ) : (
            <MenuItem value="">No {type.toLowerCase()}s available</MenuItem>
          )}
        </Select>
      </FormControl>
    );
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Complaint submitted successfully!
        </Alert>
      )}
      
      <TextField
        fullWidth
        label="Subject"
        name="subject"
        value={form.subject}
        onChange={handleChange}
        margin="normal"
        required
      />
      
      <TextField
        fullWidth
        label="Description"
        name="description"
        value={form.description}
        onChange={handleChange}
        margin="normal"
        multiline
        rows={4}
        required
      />
      
      <FormControl component="fieldset" margin="normal" required>
        <FormLabel component="legend">Complaint About</FormLabel>
        <RadioGroup row name="complaintType" value={form.complaintType} onChange={handleChange}>
          <FormControlLabel value="RESTAURANT" control={<Radio />} label="Restaurant" />
          <FormControlLabel value="TRAVEL_PACKAGE" control={<Radio />} label="Travel Package" />
          <FormControlLabel value="TRAVEL_AGENCY" control={<Radio />} label="Travel Agency" />
        </RadioGroup>
      </FormControl>
      
      {renderEntityOptions()}
      
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        {onClose && (
          <Button onClick={onClose} sx={{ mr: 1 }} disabled={loading}>
            Cancel
          </Button>
        )}
        
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          disabled={loading || success}
        >
          {loading ? <CircularProgress size={24} /> : 'Submit Complaint'}
        </Button>
      </Box>
    </Box>
  );
}