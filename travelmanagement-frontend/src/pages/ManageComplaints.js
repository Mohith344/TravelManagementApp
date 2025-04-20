import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
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

export default function ManageComplaints() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Response dialog state
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [responseForm, setResponseForm] = useState({
    status: 'PENDING',
    response: ''
  });
  const [submittingResponse, setSubmittingResponse] = useState(false);
  
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/admin/complaints' } });
      return;
    }
    
    // Only allow admins to access this page
    if (user.role !== 'ADMIN' && user.role !== 'ROLE_ADMIN') {
      navigate('/');
      return;
    }
    
    fetchAllComplaints();
  }, [user, navigate]);
  
  const fetchAllComplaints = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/complaints/all');
      setComplaints(response.data);
    } catch (err) {
      console.error('Error fetching complaints:', err);
      setError('Failed to load complaints. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleOpenResponseDialog = (complaintId, currentStatus, currentResponse) => {
    setSelectedComplaintId(complaintId);
    setResponseForm({
      status: currentStatus || 'PENDING',
      response: currentResponse || ''
    });
    setResponseDialogOpen(true);
  };
  
  const handleCloseResponseDialog = () => {
    setResponseDialogOpen(false);
    setSelectedComplaintId(null);
  };
  
  const handleResponseFormChange = (e) => {
    const { name, value } = e.target;
    setResponseForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmitResponse = async () => {
    try {
      setSubmittingResponse(true);
      await axios.put(`/api/complaints/${selectedComplaintId}/status`, null, {
        params: {
          status: responseForm.status,
          response: responseForm.response
        }
      });
      
      // Show success and refresh
      setSuccessMessage('Response submitted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Refresh complaints
      fetchAllComplaints();
      
      // Close dialog
      handleCloseResponseDialog();
      
    } catch (err) {
      console.error('Error submitting response:', err);
      setError('Failed to submit response. Please try again.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setSubmittingResponse(false);
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
      case 'IN_PROGRESS':
        return <AccessTimeIcon color="info" />;
      default:
        return <PendingIcon color="warning" />;
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'RESOLVED':
        return 'success';
      case 'REJECTED':
        return 'error';
      case 'IN_PROGRESS':
        return 'info';
      default:
        return 'warning';
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
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1">
            Manage Complaints
          </Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}
        
        {complaints.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No complaints found.
            </Typography>
          </Paper>
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
                        color={getStatusColor(complaint.status)}
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
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EventIcon sx={{ mr: 1, fontSize: 'small', color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          Submitted: {formatDate(complaint.createdAt)}
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary">
                        By: {complaint.username}
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
                    
                    <Box sx={{ mt: 2, textAlign: 'right' }}>
                      <Button 
                        variant="contained" 
                        onClick={() => handleOpenResponseDialog(complaint.id, complaint.status, complaint.response)}
                      >
                        {complaint.response ? 'Update Response' : 'Respond'}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        
        {/* Response Dialog */}
        <Dialog 
          open={responseDialogOpen} 
          onClose={handleCloseResponseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Respond to Complaint</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="normal">
              <InputLabel id="status-select-label">Status</InputLabel>
              <Select
                labelId="status-select-label"
                name="status"
                value={responseForm.status}
                label="Status"
                onChange={handleResponseFormChange}
              >
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="RESOLVED">Resolved</MenuItem>
                <MenuItem value="REJECTED">Rejected</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              margin="normal"
              name="response"
              label="Response"
              multiline
              rows={4}
              value={responseForm.response}
              onChange={handleResponseFormChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseResponseDialog}>Cancel</Button>
            <Button 
              onClick={handleSubmitResponse} 
              variant="contained"
              disabled={submittingResponse}
            >
              {submittingResponse ? <CircularProgress size={24} /> : 'Submit'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}