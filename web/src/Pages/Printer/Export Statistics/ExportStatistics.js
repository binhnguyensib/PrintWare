import React from 'react';
import { Button, Typography, Box, Card, CardContent } from '@mui/material';

const ExportStatistics = () => {
  const handleExport = () => {
    alert('Exporting statistics as PDF...');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5', // Màu nền xám nhạt cho background
        padding: '20px',
      }}
    >
      {/* Tiêu đề */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 'bold',
          marginBottom: '20px',
          color: '#333', // Màu chữ đậm hơn
        }}
      >
        Export Statistics
      </Typography>

      {/* Card hiển thị thông tin chi tiết */}
      <Card
        sx={{
          maxWidth: '400px',
          width: '100%',
          backgroundColor: '#ffffff',
          boxShadow: 3,
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ marginBottom: '10px', fontWeight: 'bold' }}>
            Log Type: General Printing Log
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: '10px' }}>
            Total Prints: 1200
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: '10px' }}>
            Average Prints per Day: 50
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: '10px' }}>
            Most Active Printer: Printer A
          </Typography>
        </CardContent>
      </Card>

      {/* Nút xuất PDF */}
      <Button
        variant="contained"
        onClick={handleExport}
        sx={{
          padding: '12px 24px',
          backgroundColor: '#007bff', // Màu nền nút
          color: '#fff',
          fontSize: '16px',
          '&:hover': {
            backgroundColor: '#0056b3', // Màu khi hover
          },
          marginTop: '20px',
          borderRadius: '8px',
        }}
      >
        Export PDF
      </Button>
    </Box>
  );
};

export default ExportStatistics;