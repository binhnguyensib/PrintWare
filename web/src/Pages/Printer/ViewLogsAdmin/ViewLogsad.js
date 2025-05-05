import React, { useState } from 'react';
import { Box, Typography, Menu, MenuItem, Button, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ViewLog = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLogType, setSelectedLogType] = useState(null);
  const navigate = useNavigate(); // Hook to navigate to another page

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogTypeSelect = (logType) => {
    setSelectedLogType(logType);
    setAnchorEl(null); // Close the menu after selection
  };

  const handleExport = () => {
    // Navigate to ExportStatistics and pass the selected log type
    navigate('/export-statistics', { state: { logType: selectedLogType } });
  };

  const renderDashboard = () => {
    switch (selectedLogType) {
      case 'General Printing Log':
        return (
          <Box sx={{ marginTop: '20px' }}>
            <Typography variant="h5">General Printing Log Dashboard</Typography>
            <Card sx={{ marginTop: '20px', padding: '20px' }}>
              <CardContent>
                <Typography variant="h6">Total Prints: 1200</Typography>
                <Typography variant="h6">Average Prints per Day: 50</Typography>
                <Typography variant="h6">Most Active Printer: Printer A</Typography>
              </CardContent>
            </Card>
          </Box>
        );
      case 'General Payment Log':
        return (
          <Box sx={{ marginTop: '20px' }}>
            <Typography variant="h5">General Payment Log Dashboard</Typography>
            <Card sx={{ marginTop: '20px', padding: '20px' }}>
              <CardContent>
                <Typography variant="h6">Total Payments: $5000</Typography>
                <Typography variant="h6">Average Payment per Transaction: $200</Typography>
                <Typography variant="h6">Highest Payment: $1000</Typography>
              </CardContent>
            </Card>
          </Box>
        );
      default:
        return <Typography>Select a log type to view its dashboard</Typography>;
    }
  };

  return (
    <Box sx={{ marginTop: '50px', height: '100vh', padding: '20px' }}>
      <Typography variant="h4">View Log</Typography>

      {/* Hover Dropdown Button */}
      <Button variant="contained" onClick={handleClick} sx={{ marginTop: '20px' }}>
        Select Log Type
      </Button>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => handleLogTypeSelect('General Printing Log')}>
          General Printing Log
        </MenuItem>
        <MenuItem onClick={() => handleLogTypeSelect('General Payment Log')}>
          General Payment Log
        </MenuItem>
      </Menu>

      {/* Display Dashboard Based on Selected Log Type */}
      {renderDashboard()}

      {/* Button to Export Log */}
      <Button 
        variant="contained" 
        onClick={handleExport} 
        sx={{ marginTop: '20px' }}
        disabled={!selectedLogType} // Disable if no log type is selected
      >
        Export Log as PDF
      </Button>
    </Box>
  );
};

export default ViewLog;