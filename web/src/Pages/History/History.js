import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, List, ListItem } from '@mui/material';

import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/ui/Loading/LoadingSpinner'; // Import LoadingSpinner

const History = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    const saveHistory = JSON.parse(localStorage.getItem('filteredHistory'));
    if (saveHistory) {
      setFilteredHistory(saveHistory);
    }
  }, []);

  const handleFilter = () => {
    fetchLogGet(localStorage.getItem('accessToken'));
  };

  const fetchLogGet = async (token) => {
    if (!startDate || !endDate) {
      setError('Please fill in all fields');
      localStorage.removeItem('filteredHistory');
      setFilteredHistory([])
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/log/get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ start: startDate, end: endDate }),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success('Filter success');
        setFilteredHistory(result);
        localStorage.setItem('filteredHistory', JSON.stringify(result));
        setError('');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      setError(error);
    }finally {
      setLoading(false); // Kết thúc trạng thái loading
    }
  };
  return (
    <Box sx={{ p: 3, ml: '1.5cm', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Page title */}
      <Typography variant="h3" gutterBottom sx={{ mb: 3 }}></Typography>
      {/* Time input form */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            sx={{ width: 200 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            sx={{ width: 200 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
        <Button variant="contained" onClick={handleFilter}  sx={{ 
            bgcolor: '#0004ff' ,
            color: '#fff',
            '&:hover': {              
                color: '#0004ff',
                bgcolor: '#fff'
            },
          }}>
          Filter
        </Button>
      </Box>

      <Paper sx={{
        p: 3, height: 'calc(100% - 64px)',
        overflowY: 'auto', width: '75%', mx: 'auto', mt: 3, border: '2px solid #ccc',
        borderRadius: '16px',
        background: `linear-gradient(to bottom, 
        rgba(255, 255, 255, 0.6) 5%, 
        rgba(255, 255, 255, 1) 100%)`,
      }}>
        {error && (
          <Typography color="error" sx={{ mb: 3, textAlign: 'center', fontSize: '1.5rem' }}>
            {error}
          </Typography>
        )}
        <List>
          {filteredHistory.map((record, index) => (
            <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc' }}>
              <Box sx={{ flexBasis: '40%', textAlign: 'center' }}>
                {new Date(record.Date).toLocaleString()}
              </Box>
              <Box sx={{ flexBasis: '1px', backgroundColor: '#ccc', height: '100%' }} />
              <Box sx={{ flexBasis: '60%', textAlign: 'left' }}>
                {record.activity}
              </Box>
            </ListItem>
          ))}
          {/* Hiển thị spinner nếu đang loading */}
          {loading && <LoadingSpinner />}
        </List>
      </Paper>
      

    </Box>
  );
};

export default History;
