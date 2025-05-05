// src/components/SidebarLayout.js
import React, { useState, useEffect } from 'react';
import { Box} from '@mui/material';
import MiniSidebar from './MiniSidebar';

const SidebarLayout = ({ onLogout, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // Load sidebar state from localStorage when component mounts
    const savedState = localStorage.getItem('sidebarOpen');
    if (savedState !== null) {
      setIsSidebarOpen(JSON.parse(savedState));
    }
  }, []);

  useEffect(() => {
    // Save sidebar state to localStorage when it changes
    localStorage.setItem('sidebarOpen', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);


  return (
    <Box sx={{ display: 'flex', overflow: 'hidden', position: 'relative' }}>
      <MiniSidebar 
        isOpen={isSidebarOpen} 
        onLogout={onLogout}
      />
      <Box 
        sx={{ 
          flexGrow: 1, 
          height: '100%',
          boxSizing: 'border-box',
          overflow: 'auto',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default SidebarLayout;
