import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Avatar, Grid, Paper } from '@mui/material';
import PasswordDialog from './ChangePass';
import { InputAdornment } from '@mui/material';
import Swal from 'sweetalert2';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import LoadingSpinner from '../../components/ui/Loading/LoadingSpinner';

import axios from 'axios';
import { CustomerModelKeys } from '../../models/User.js';
import { getImage } from '../../services/IndexDB.js';

const showAlert = (message, type) => {
  Swal.fire({
    icon: type,
    title: type === 'error' ? 'Oops...' : 'Success',
    text: message,
    confirmButtonText: 'OK',
  });
};

const Profile = () => {
  const [ userName, setUsername ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ phoneNum, setPhone ] = useState('');
  const [ classId, setClass ] = useState('');
  const [ hcmutId, setHcmutId ] = useState('');
  const [ faculty, setFaculty ] = useState('');
  const [ major, setMajor ] = useState('')
  const [ academicYear, setAcademicYear ] = useState('')
  const [ avatar, setAvatar ] = useState('');
  const [ originalAvatar, setOriginalAvatar ] = useState('');
  const [ coverPhoto, setCoverPhoto ] = useState('');
  const [ originalCoverPhoto, setOriginalCoverPhoto ] = useState('');

  const [ isEditable, setIsEditable ] = useState(false);
  const [ isPasswordDialogOpen, setIsPasswordDialogOpen ] = useState(false);
  const [ isPasswordConfirmed, setIsPasswordConfirmed ] = useState(false);
  const [ loading, setLoading ] = useState(false); 

  const loadData = async () => {
    setEmail(localStorage.getItem(CustomerModelKeys.email));
    setUsername(localStorage.getItem(CustomerModelKeys.userName));
    setPhone(localStorage.getItem(CustomerModelKeys.phoneNum));
    setHcmutId(localStorage.getItem(CustomerModelKeys.hcmutId));
    setFaculty(localStorage.getItem(CustomerModelKeys.faculty));
    setMajor(localStorage.getItem(CustomerModelKeys.major));
    setAcademicYear(localStorage.getItem(CustomerModelKeys.academicYear));
    setClass(localStorage.getItem(CustomerModelKeys.classId));

    if (localStorage.getItem('avatarId')) {
      // setAvatar(localStorage.getItem(CustomerModelKeys.avatar));
      // setOriginalAvatar(localStorage.getItem(CustomerModelKeys.avatar));
      await getImage(CustomerModelKeys.avatar).then((result) => {
        setAvatar(result ? (result.src ? result.src : '') : '');
        setOriginalAvatar(result ? (result.src ? result.src : '') : '');
      }).catch((error) => {
        console.error('Error getting avatar image: ', error);
        setAvatar('');
        setOriginalAvatar('');
      });
    } else {
      setAvatar('');
      setOriginalAvatar('');
    }
    if (localStorage.getItem('coverPhotoId')) {
      // setCoverPhoto(localStorage.getItem(CustomerModelKeys.coverPhoto));
      // setOriginalCoverPhoto(localStorage.getItem(CustomerModelKeys.coverPhoto));
      await getImage(CustomerModelKeys.coverPhoto).then((result) => {
        setCoverPhoto(result ? (result.src ? result.src : '') : '');
        setOriginalCoverPhoto(result ? (result.src ? result.src : '') : '');
      }).catch((error) => {
        console.error('Error getting cover photo image: ', error);
        setCoverPhoto('');
        setOriginalCoverPhoto('');
      });
    }
    else {
      setCoverPhoto('');
      setOriginalCoverPhoto('');
    }
  };

  const fetchProfileEdit = async (isProfileChanged) => {
    if (!localStorage.getItem(CustomerModelKeys.userId)) {
      showAlert('User not found', 'error');
      return;
    }
    if (!localStorage.getItem('accessToken')) {
      showAlert('Access token not found', 'error');
      return;
    }
    if (!localStorage.getItem(CustomerModelKeys.userRole)) {
      showAlert('User role not found', 'error');
      return;
    }
    if (!userName) {
      showAlert('userName is required', 'error');
      return;
    }
    if (!hcmutId || !faculty) {
      showAlert('Student Id and Faculty are required', 'error');
      return;
    }

    setLoading(true);

    const token = localStorage.getItem('accessToken');

    const formData = new FormData();
    if (document.querySelector('input[name="userName"]').value) formData.append(CustomerModelKeys.userName, document.querySelector('input[name="userName"]').value);
    if (document.querySelector('input[name="phoneNum"]').value) formData.append(CustomerModelKeys.phoneNum, document.querySelector('input[name="phoneNum"]').value);
    if (document.querySelector('input[name="hcmutId"]').value) formData.append(CustomerModelKeys.hcmutId, document.querySelector('input[name="hcmutId"]').value);
    if (document.querySelector('input[name="faculty"]').value) formData.append(CustomerModelKeys.faculty, document.querySelector('input[name="faculty"]').value);
    if (document.querySelector('input[name="major"]').value) formData.append(CustomerModelKeys.major, document.querySelector('input[name="major"]').value);
    if (document.querySelector('input[name="academicYear"]').value) formData.append(CustomerModelKeys.academicYear, document.querySelector('input[name="academicYear"]').value);
    if (document.querySelector('input[name="classId"]').value) formData.append(CustomerModelKeys.classId, document.querySelector('input[name="classId"]').value);

    const avaFormData = new FormData();
    const coverFormData = new FormData();

    const fileInputAvatar = document.querySelector('input[name="avatar"]');
    const fileInputCover = document.querySelector('input[name="coverPhoto"]');
    if (fileInputAvatar && fileInputAvatar.files[0]) {
      avaFormData.append('file', fileInputAvatar.files[0]);
    }
    if (fileInputCover && fileInputCover.files[0]) {
      coverFormData.append('file', fileInputCover.files[0]);
    }

    if (!avaFormData.has('file') && !coverFormData.has('file') && !isProfileChanged) {
      setLoading(false);
      showAlert('No changes detected', 'warning');
      return;
    }

    const responses = await Promise.allSettled([
      isProfileChanged && axios.patch(`${process.env.REACT_APP_SERVER_URL}/hcmut-sso/update-profile`, formData, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        params: {
          userId: localStorage.getItem(CustomerModelKeys.userId),
          userRole: localStorage.getItem(CustomerModelKeys.userRole)
        }
      }),
      avaFormData.has('file') && axios.post(`${process.env.REACT_APP_SERVER_URL}/hcmut-sso/upload-picture`, avaFormData, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
        params: {
          userId: localStorage.getItem(CustomerModelKeys.userId),
          type: 'avatar'
        }
      }),
      coverFormData.has('file') && axios.post(`${process.env.REACT_APP_SERVER_URL}/hcmut-sso/upload-picture`, coverFormData, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
        params: {
          userId: localStorage.getItem(CustomerModelKeys.userId),
          type: 'coverPhoto'
        }
      })
    ]);

    responses.forEach((response, index) => {
      if (response !== undefined) {
        if (response.status === 'fulfilled') {
          if (index === 0) {
            const result = response.value.data;
            console.log('Update profile result: ', result);
            setIsEditable(false);

            if (formData.has(CustomerModelKeys.email)) localStorage.setItem(CustomerModelKeys.email, formData.get(CustomerModelKeys.email));
            if (formData.has(CustomerModelKeys.userName)) localStorage.setItem(CustomerModelKeys.userName, formData.get(CustomerModelKeys.userName));
            if (formData.has(CustomerModelKeys.phoneNum)) localStorage.setItem(CustomerModelKeys.phoneNum, formData.get(CustomerModelKeys.phoneNum));
            if (formData.has(CustomerModelKeys.hcmutId)) localStorage.setItem(CustomerModelKeys.hcmutId, formData.get(CustomerModelKeys.hcmutId));
            if (formData.has(CustomerModelKeys.faculty)) localStorage.setItem(CustomerModelKeys.faculty, formData.get(CustomerModelKeys.faculty));
            if (formData.has(CustomerModelKeys.major)) localStorage.setItem(CustomerModelKeys.major, formData.get(CustomerModelKeys.major));
            if (formData.has(CustomerModelKeys.academicYear)) localStorage.setItem(CustomerModelKeys.academicYear, formData.get(CustomerModelKeys.academicYear));
            if (formData.has(CustomerModelKeys.classId)) localStorage.setItem(CustomerModelKeys.classId, formData.get(CustomerModelKeys.classId));
          }
          else {
            const result = response.value.data;
            if (result) {
              if (index === 1) {
                console.log('Update avatar result: ', result);
                if (avatar) localStorage.setItem(CustomerModelKeys.avatar, avatar);
                localStorage.setItem('avatarId', result.data);
              }
              else if (index === 2) {
                console.log('Update cover photo result: ', result);
                if (coverPhoto) localStorage.setItem(CustomerModelKeys.coverPhoto, coverPhoto);
                localStorage.setItem('coverPhotoId', result.data);
              }
            }
          }
        }
        else if (response.status === 'rejected') {
          if (index === 0) {
            console.error("Error update profile data: ", response.reason)
          }
          else if (index === 1) {
            console.error("Error update avatar data: ", response.reason)
          }
          else {
            console.error("Error update cover photo data: ", response.reason)
          }
          setIsEditable(false);
        }
      }
      setLoading(false);
    });

    loadData();

    setLoading(false);
  };

  const checkProfileChanged = () => {
    return new Promise((resolve) => {
      const currentUserName = document.querySelector('input[name="userName"]').value;
      const currentPhoneNum = document.querySelector('input[name="phoneNum"]').value;
      const currentHcmutId = document.querySelector('input[name="hcmutId"]').value;
      const currentFaculty = document.querySelector('input[name="faculty"]').value;
      const currentMajor = document.querySelector('input[name="major"]').value;
      const currentAcademicYear = document.querySelector('input[name="academicYear"]').value;
      const currentClassId = document.querySelector('input[name="classId"]').value;
  
      if (
        currentUserName !== userName ||
        currentPhoneNum !== phoneNum ||
        currentHcmutId !== hcmutId ||
        currentFaculty !== faculty ||
        currentMajor !== major ||
        currentAcademicYear !== academicYear ||
        currentClassId !== classId
      ) {
        resolve(true);
      }
      else resolve(false);
    });
  };

  const handleSave = () => {
    checkProfileChanged().then((result) => {
      fetchProfileEdit(result);
    });
  };

  const handleCancel = () => {
    loadData();
    setIsEditable(false);
    setAvatar(originalAvatar);
    setCoverPhoto(originalCoverPhoto);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverPhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChangeClick = () => {
    if (isEditable) {
      setIsPasswordDialogOpen(true);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const obfuscatePhone = (phoneNum) => {
    if (!phoneNum) return '';
    const digits = phoneNum.replace(/\D/g, '');
    return `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
  };

  const obfuscateEmail = (email) => {
    if (!email) return '';
    const [user, domain] = email.split('@');
    return `${user.slice(0, 2)}${'*'.repeat(user.length - 2)}@${domain}`;
  };
  return (
    <Box sx={{ p: 3, maxWidth: '600px', margin: 'auto',height:'100vh',marginTop: '50px',}}>
      <Paper sx={{ p: 2, borderRadius: '17px' ,background: `linear-gradient(to bottom, 
                    rgba(255, 255, 255, 0.6) 5%, 
                    rgba(255, 255, 255, 1) 100%)`,}}>
        {/* Cover Photo Section */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: 200, // Adjust height as needed
            backgroundImage: `url(${coverPhoto})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '17px',
            border: '1px solid #ddd', // Border around the cover photo
            mb: 2,
          }}
        >
          {isEditable && (
            <Button
              variant="contained"
              component="label"
              sx={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                bgcolor: '#ffffff',
                color: '#000',
                fontSize: '0.75rem', // Kích thước chữ nhỏ hơn
                padding: '4px 8px', // Kích thước nút nhỏ hơn
                '&:hover': {
                  bgcolor: '#e0e0e0',
                },
              }}
            >
              Upload Cover Photo
              <input
                type="file"
                name="coverPhoto"
                hidden
                onChange={handleCoverPhotoChange}
              />
            </Button>
          )}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              mb: 2,
            }}
          >
            <Avatar src={avatar} sx={{ width: 100, height: 100,top:15, }} />
            {isEditable && (
              <Button
                variant="contained"
                component="label"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: '#ffffff',
                  color: '#000',
                  padding: '1px 1px', // Kích thước nút nhỏ hơn
                  borderRadius: '20px',
                  '&:hover': {
                    bgcolor: '#e0e0e0',
                  },
                }}
              >
                <CameraAltIcon />
                <input
                  type="file"
                  name="avatar"
                  hidden
                  onChange={handleAvatarChange}
                />
              </Button>
            )}
          </Box>
        </Box>

        {/* Profile Form */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              value={isEditable ? email : obfuscateEmail(email)}
              // onChange={(e) => setEmail(e.target.value)}
              fullWidth
              InputProps={{
                readOnly: true, // Email is always read-only
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              type="password"
              value="**** ****"
              fullWidth
              InputProps={{
                readOnly: true,
                endAdornment: isEditable && (
                  <InputAdornment position="end">
                    <Button
                      variant="text"
                      sx={{ textTransform: 'none' }}
                      onClick={handlePasswordChangeClick}
                    >
                      Click here to change password
                    </Button>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                shrink: true, // Always keep the label on top
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="User Name"
              name="userName"
              value={isEditable ? null : userName}
              // onChange={(e) => setUsername(e.target.value)}
              fullWidth
              InputProps={{
                readOnly: !isEditable,
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone Number"
              name="phoneNum"
              value={isEditable ? phoneNum : obfuscatePhone(phoneNum)}
              fullWidth
              InputProps={{
                readOnly: !isEditable,
              }}
              InputLabelProps={{
                shrink: true, // Always keep the label on top
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Student ID"
              name="hcmutId"
              value={isEditable ? null : hcmutId}
              // onChange={(e) => setHcmutId(e.target.value)}
              fullWidth
              InputProps={{
                readOnly: !isEditable,
              }}
              InputLabelProps={{
                shrink: true, // Always keep the label on top
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Faculty"
              name="faculty"
              value={isEditable ? null : faculty}
              // onChange={(e) => setFaculty(e.target.value)}
              fullWidth
              InputProps={{
                readOnly: !isEditable,
              }}
              InputLabelProps={{
                shrink: true, // Always keep the label on top
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Major"
              name="major"
              value={isEditable ? null : major}
              // onChange={(e) => setMajor(e.target.value)}
              fullWidth
              InputProps={{
                readOnly: !isEditable,
              }}
              InputLabelProps={{
                shrink: true, // Always keep the label on top
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Academic Year"
              name="academicYear"
              value={isEditable ? null : academicYear}
              // onChange={(e) => setAcademicYear(e.target.value)}
              fullWidth
              InputProps={{
                readOnly: !isEditable,
              }}
              InputLabelProps={{
                shrink: true, // Always keep the label on top
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Class ID"
              name="classId"
              value={isEditable ? null : classId}
              // onChange={(e) => setClass(e.target.value)}
              fullWidth
              InputProps={{
                readOnly: !isEditable,
              }}
              InputLabelProps={{
                shrink: true, // Always keep the label on top
              }}
            />
          </Grid>
          
          <Grid
            item
            xs={12}
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            {!isEditable ? (
              <Button variant="contained" onClick={() => setIsEditable(true)}>
                Edit
              </Button>
            ) : (
              <>
                <Button
                  variant="outlined"
                  sx={{
                    bgcolor: '#ff0505',
                    color: '#fff',
                    '&:hover': {
                      bgcolor: '#b50000', // Dark red on hover
                    },
                  }}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>

                {/* Container for LoadingSpinner to not affect layout */}
                <Box sx={{ position: 'relative', width: '50px', height: '50px', alignItems: 'center' }}>
                  {loading && (
                    <Box sx={{ position: 'absolute', top: 0, left: 0 }}>
                      <LoadingSpinner />
                    </Box>
                  )}
                </Box>

                <Button variant="contained" color="primary" onClick={handleSave}>
                  Save
                </Button>
              </>
            )}
          </Grid>

        </Grid>
      </Paper>

      {/* Password Dialog */}
      <PasswordDialog
        open={isPasswordDialogOpen}
        onClose={() => {
          setIsPasswordDialogOpen(false);
          if (isPasswordConfirmed) {
            // Refresh profile data if the password was confirmed
            loadData();
          }
        }}
        onConfirm={(confirmed) => {
          setIsPasswordConfirmed(confirmed); // Đảm bảo setIsPasswordConfirmed được gọi đúng cách
          if (confirmed) {
            setIsPasswordDialogOpen(false); // Close the dialog if password is confirmed
          }
        }}
      />
    </Box>
  );
};

export default Profile;
