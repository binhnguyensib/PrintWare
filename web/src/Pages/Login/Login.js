import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField, Button, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import Signup from '../../components/auth/Signup';
import Forget from '../../components/auth/Forget';
import LoadingSpinner from '../../components/ui/Loading/LoadingSpinner'; // Import LoadingSpinner

import { loginWithEmailAndPassword } from '../../controllers/HCMUT_SSO.js';
import { CustomerModelKeys } from '../../models/User.js';

export default function Login({ onLogin }) {
  const [emailOrusername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading
  const [openSignup, setOpenSignup] = useState(false);
  const [openForget, setOpenForget] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!emailOrusername || !password) {
      setError('Username and password are required.');
      return;
    }

    try {
      setLoading(true); // Bắt đầu trạng thái loading

      const result = await loginWithEmailAndPassword(emailOrusername, password);
      
      console.log('Login result: ', result.message);
      setError('');
      const { user, customToken } = result.data;
      localStorage.setItem(CustomerModelKeys.userId, user.uid);
      localStorage.setItem('accessToken', customToken);
      localStorage.setItem('isLoggedIn', 'true');
      
      onLogin(true);
      navigate('/home');
    } catch (error) {
      console.error('Error when login:', error);
      if (error.code === 'auth/user-not-found') {
        setError('User not found!');
      }
      else if (error.code === 'auth/invalid-email') {
        setError('Invalid email!');
      }
      else if (error.code === 'auth/invalid-credential') {
        setError('Something is wrong with your email or password!');
      }
      else setError(error.message || 'Failed to login!');
    } finally {
      setLoading(false); // Kết thúc trạng thái loading
    }
  };

  const handleOpenSignup = () => setOpenSignup(true);
  const handleCloseSignup = () => setOpenSignup(false);

  const handleOpenForget = () => setOpenForget(true);
  const handleCloseForget = () => setOpenForget(false);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin(e);
    }
  };

  return (
    <Box
      
      sx={{
        height: '100vh',
        width: '100vw',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
        padding: 0,
       
      }}
    >
      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 3,
        }}
      >
       
        <Typography variant="h4" sx={{ mb: 3, }}>
          Login
        </Typography>
        
          <>
            <TextField
              label="Username"
              value={emailOrusername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              fullWidth
              sx={{ mb: 0 }}
            />
            <Box sx={{ mt: 0, textAlign: 'right' }}>
              <Button onClick={handleOpenForget} sx={{ textTransform: 'lowercase' }}>
                Forgot password ?
              </Button>
            </Box>
            {error && <Typography color="error" sx={{ mb: 3 }}>{error}</Typography>}
            <Button sx={{ mt: 3, height: 55,}} variant="contained" color="primary" onClick={handleLogin} fullWidth>
              {loading ? <LoadingSpinner /> : 'Login'}
            </Button>
            <Typography sx={{ mt: 2 }}>
              <Button onClick={handleOpenSignup}>Create new account</Button>
            </Typography>
          </>
      
      </Box>

      <Dialog open={openSignup} onClose={handleCloseSignup}>
        <DialogTitle>Sign Up</DialogTitle>
        <DialogContent>
          <Signup onClose={handleCloseSignup} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSignup}>Close</Button>
        </DialogActions>
      </Dialog>

      <Forget open={openForget} onClose={handleCloseForget} />
    </Box>
  );
}
