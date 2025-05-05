import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import LoadingSpinner from '../ui/Loading/LoadingSpinner';

import axios from 'axios';
import { CustomerModelKeys } from '../../models/User.js';

export default function Signup({ onClose }) {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ confirmPassword, setConfirmPassword ] = useState('');
  const [ userName, setUserName ] = useState('');
  const [ phoneNum, setPhoneNum ] = useState('');
  const [ hcmutId, setHcmutId ] = useState('');
  const [ faculty, setFaculty ] = useState('');
  const [ major, setMajor ] = useState('');
  const [ academicYear, setAcademicYear ] = useState('');
  const [ classId, setClassId ] = useState('');

  const [ error, setError ] = useState('');
  const [ success, setSuccess ] = useState('');
  const [ loading, setLoading ] = useState(false); 

  const Signup = async () => {
    if (
      !userName ||
      !email ||
      !password ||
      !confirmPassword ||
      !phoneNum ||
      !hcmutId ||
      !faculty ||
      !major ||
      !academicYear ||
      !classId
    ) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append(CustomerModelKeys.email, email);
      formData.append('password', password);
      formData.append(CustomerModelKeys.userName, userName);
      formData.append(CustomerModelKeys.phoneNum, phoneNum);
      formData.append(CustomerModelKeys.hcmutId, hcmutId);
      formData.append(CustomerModelKeys.faculty, faculty);
      formData.append(CustomerModelKeys.major, major);
      formData.append(CustomerModelKeys.academicYear, academicYear);
      formData.append(CustomerModelKeys.classId, classId);
      
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/hcmut-sso/register`, formData, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = response.data;

      setSuccess(result.message);
      setError('');

      // Close modal after 1 second
      setTimeout(() => {
        setSuccess('');
        onClose(); // Call onClose to close the signup dialog
      }, 1000);
    }
    catch (error) {
      const response = error.response;
      if (response && response.data && response.data.message) {
        setError(response.data.message);
      } else {
        setError('Failed to connect to the server');
      }
    }finally {
      setLoading(false); // Kết thúc loading
    }
  }

  return (
    <>
      <Box sx={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 3 }}></Typography>
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="User Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Phone Number"
          value={phoneNum}
          onChange={(e) => setPhoneNum(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="ID Student"
          value={hcmutId}
          onChange={(e) => setHcmutId(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Faculty"
          value={faculty}
          onChange={(e) => setFaculty(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Major"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Academic Year"
          value={academicYear}
          onChange={(e) => setAcademicYear(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Class ID"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
        {success && <Typography color="success" sx={{ mb: 2 }}>{success}</Typography>}

        <Button variant="contained" color="primary" onClick={Signup} fullWidth>
          {loading ? <LoadingSpinner /> : 'Sign Up'}
        </Button>
      </Box>
    </>
  );
}
