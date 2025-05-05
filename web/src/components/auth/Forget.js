import React, { useState } from 'react';
import {
  TextField, Button, Box, Typography,
  Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import LoadingSpinner from '../ui/Loading/LoadingSpinner';

import axios from 'axios';
import { sendCustomPasswordResetEmail, resetPassword} from '../../controllers/HCMUT_SSO.js';

export default function Forget({ open, onClose }) {
  const [step, setStep] = useState('request'); // Các bước: 'request', 'verify', 'resetPassword'
  const [emailOrusername, setEmailOrUsername] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false); 


  const handleRequest = async () => {
    if (!emailOrusername) {
      setError("Email is required!");
      return;
    }

    try {
      setLoading(true);
      
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/hcmut-sso/get-user-id-by-email`, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_SERVER_TOKEN}`
        },
        params: {
          email: emailOrusername
        }
      });

      if (response.status === 200) {
        const result = await sendCustomPasswordResetEmail(emailOrusername);
        setStep('vertidyAndResetPassword');
        setSuccess(result.message);
        // setSuccess('Instructions for resetting your password have been sent.');
      }
    } catch (error) {
      console.log('Error when request:', error);
      if (!error.response) {
        setError(error.message || 'Failed to send reset password email!');
      }
      else {
        setError(error.response.data.message || 'Failed to connect to the server!');
      }
    }finally {
      setLoading(false); // Kết thúc loading
    }
  };

  const handleResetPassword = async () => {
    // eslint-disable-next-line no-const-assign
    if (!verificationCode || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }


    try {
      setLoading(true);
      
      const result = await resetPassword(verificationCode, newPassword);

      setError('');
      setSuccess(`${result.message}. Redirecting to login...`);
      setTimeout(() => {
        onClose();
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.log('Error when reset password:', error);
      setError(error.message || 'Failed to change password!');
      resetState();
    }
    finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setEmailOrUsername('');
    setVerificationCode('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    setStep('request');
    setLoading(false);
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Forgot Password</DialogTitle>
      <DialogContent>
        <Box sx={{ padding: 2, textAlign: 'center' }}>
          {success && <Typography color="success" sx={{ mb: 2 }}>{success}</Typography>}
          {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
          {step === 'request' && (
            <>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Enter your email or username to reset your password
              </Typography>
              <TextField
                label="Email or Username"
                value={emailOrusername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
            </>
          )}
          {step === 'vertidyAndResetPassword' && (
            <>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Enter the verification code/link sent to your email
              </Typography>
              <TextField
                label="Verification Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Typography variant="h6" sx={{ mb: 3 }}>
                Enter your new password
              </Typography>
              <TextField
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-end' }}>
        <Button onClick={onClose}>Close</Button>
        {step === 'request' && (
          <Button variant="contained" color="primary" onClick={handleRequest}>
           {loading ? <LoadingSpinner /> : 'Submit'} 
          </Button>
        )}
        {step === 'vertidyAndResetPassword' && (
          <Button variant="contained" color="primary" onClick={handleResetPassword}>
            {loading ? <LoadingSpinner /> : 'Reset Password'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
