import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ManageConfiguration = () => {
  const navigate = useNavigate();

  const [config, setConfig] = useState({
    allowedFormats: 'PDF, DOCX',
    defaultPages: 10,
  });

  const handleSave = () => {
    // Giả lập lưu cấu hình
    alert('Configuration saved!');
  };

  return (
    <Box sx={{ marginTop: '50px', padding: '20px', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Manage Configuration
      </Typography>

      {/* Paper Container for better layout */}
      <Paper sx={{ padding: '20px', boxShadow: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Allowed Formats
            </Typography>
            <TextField
              label="Allowed Formats"
              value={config.allowedFormats}
              onChange={(e) => setConfig({ ...config, allowedFormats: e.target.value })}
              fullWidth
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Default Pages
            </Typography>
            <TextField
              label="Default Pages"
              value={config.defaultPages}
              onChange={(e) => setConfig({ ...config, defaultPages: e.target.value })}
              fullWidth
              type="number"
              variant="outlined"
            />
          </Grid>
        </Grid>

        {/* Save Button */}
        <Box sx={{ textAlign: 'center', marginTop: '30px' }}>
          <Button variant="contained" onClick={handleSave} size="large">
            Save Configuration
          </Button>
        </Box>
      </Paper>

      {/* Navigation Button */}
      <Box sx={{ textAlign: 'center', marginTop: '30px' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/viewlogsAD')}
          size="large"
        >
          Go to View Logs
        </Button>
      </Box>
    </Box>
  );
};

export default ManageConfiguration;