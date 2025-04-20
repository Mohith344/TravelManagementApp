import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar';
import CommentIcon from '@mui/icons-material/Comment';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PendingIcon from '@mui/icons-material/Pending';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function MyComplaints() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // New complaint form state
  const [form, setForm] = useState({
    subject: '',
    description: '',
    complaintType: 'TRAVEL_PACKAGE', // Default to 'Travel Package'
    entityName: '' // Simple text field for the name
  });
  
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/my-complaints' } });
      return;
    }
    
    fetchMyComplaints();
  }, [user, navigate]);
  
  const fetchMyComplaints = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/complaints/user/${user.username}`);
      setComplaints(response.data);
    } catch (err) {
      console.error('Error fetching complaints:', err);
      setError('Failed to load your complaints. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.subject.trim() || !form.description.trim() || !form.entityName.trim()) {
      setError('Please fill all required fields');
      return;
    }
    
    try {
      setSubmitting(true);
      setError('');
      
      const complaintData = {
        subject: form.subject,
        description: form.description,
        complaintType: form.complaintType,
        entityName: form.entityName,
        username: user.username
      };
      
      const response = await axios.post('/api/complaints', complaintData);
      
      if (response.status === 201 || response.status === 200) {
        // Reset form
        setForm({
          subject: '',
          description: '',
          complaintType: 'TRAVEL_PACKAGE',
          entityName: ''
        });
        
        // Show success message and refresh complaints
        setSubmitSuccess(true);
        fetchMyComplaints();
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
          setShowForm(false);
        }, 3000);
      }
    } catch (err) {
      console.error('Error submitting complaint:', err);
      setError(err.response?.data || 'Failed to submit complaint. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'RESOLVED':
        return <CheckCircleIcon color="success" />;
      case 'REJECTED':
        return <ErrorIcon color="error" />;
      case 'PENDING':
        return <PendingIcon color="warning" />;
      default:
        return <AccessTimeIcon color="info" />;
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
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
      <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            My Complaints
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Submit New Complaint'}
          </Button>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Complaint submitted successfully!
          </Alert>
        )}
        
        {showForm && (
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Submit New Complaint
            </Typography>
            <form onSubmit={handleSubmit}>
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
              
              <FormControl component="fieldset" sx={{ mt: 2, mb: 2 }}>
                <FormLabel component="legend">Complaint About</FormLabel>
                <RadioGroup 
                  row 
                  name="complaintType" 
                  value={form.complaintType}
                  onChange={handleChange}
                >
                  <FormControlLabel value="TRAVEL_PACKAGE" control={<Radio />} label="Travel Package" />
                  <FormControlLabel value="RESTAURANT" control={<Radio />} label="Restaurant" />
                  <FormControlLabel value="TRAVEL_AGENCY" control={<Radio />} label="Travel Agency" />
                </RadioGroup>
              </FormControl>
              
              <TextField
                fullWidth
                label="Name"
                name="entityName"
                value={form.entityName}
                onChange={handleChange}
                margin="normal"
                helperText="Enter the name of the package, restaurant, or agency"
                required
              />
              
              <Button 
                type="submit"
                variant="contained"
                sx={{ mt: 2 }}
                disabled={submitting}
              >
                {submitting ? <CircularProgress size={24} /> : 'Submit Complaint'}
              </Button>
            </form>
          </Paper>
        )}
        
        <Divider sx={{ mb: 4 }} />
        
        {complaints.length === 0 ? (
          <Box sx={{ textAlign: 'center', my: 4 }}>
            <Typography variant="h6" color="text.secondary">
              You haven't submitted any complaints yet.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {complaints.map((complaint) => (
              <Grid item xs={12} key={complaint.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6">{complaint.subject}</Typography>
                      <Chip 
                        icon={getStatusIcon(complaint.status)} 
                        label={complaint.status || 'PENDING'} 
                        color={
                          complaint.status === 'RESOLVED' ? 'success' :
                          complaint.status === 'REJECTED' ? 'error' : 'warning'
                        }
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CommentIcon sx={{ mr: 1, fontSize: 'small', color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {complaint.complaintType}: {complaint.entityName}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body1" paragraph>
                      {complaint.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EventIcon sx={{ mr: 1, fontSize: 'small', color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Submitted: {formatDate(complaint.createdAt)}
                      </Typography>
                    </Box>
                    
                    {complaint.response && (
                      <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Response:
                        </Typography>
                        <Typography variant="body2">
                          {complaint.response}
                        </Typography>
                        {complaint.resolvedAt && (
                          <Typography variant="caption" display="block" sx={{ mt: 1, textAlign: 'right' }}>
                            Responded on: {formatDate(complaint.resolvedAt)}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </>
  );
}