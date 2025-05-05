import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

import { changePassword } from '../../controllers/HCMUT_SSO.js'
import { CustomerModelKeys } from '../../models/User.js';

const PasswordDialog = ({ open, onClose, onConfirm }) => {
  const [ currentPassword, setCurrentPassword ] = useState('');
  const [ newPassword, setNewPassword ] = useState('');
  const [ confirmPassword, setConfirmPassword ] = useState('');
  const [ error, setError ] = useState('');

  const handleConfirm = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    const email = localStorage.getItem(CustomerModelKeys.email);
    if (!email) {
      setError('Email is required.');
      return;
    }

    try {
      const result = await changePassword(email, currentPassword, newPassword);
      console.log(result.message);
      
      setError('');
      onConfirm(true);
      onClose();
    } catch (error) {
      setError(error.message || 'Failed to connect to the server');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          display: 'flex',
          flexDirection: 'column', // Đảm bảo rằng các phần tử con xếp theo chiều dọc
          width: '400px', // Căn chỉnh kích thước của hộp thoại
          height: 'auto',
        }
      }}>
      <DialogTitle>Change Password</DialogTitle>
      <DialogContent>
        <TextField
          label="Current password"
          type="password"
          fullWidth
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          error={!!error}
          helperText={error}
          margin="normal"
        />
        <TextField
          label="New password"
          type="password"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Confirm new password"
          type="password"
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PasswordDialog;
