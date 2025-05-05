import React from 'react';
import { Box } from '@mui/material';

const Home = () => {
  return (
    <Box sx={{display: 'flex',height:'100vh',backgroundImage: 'url(/static/Library.jpg)', 
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      margin: 0}} >
      <h1 style={{ color: '#000', padding: '100px', margin: 0 }}>Welcome to Printer</h1>
    </Box>
  );
};

export default Home;
