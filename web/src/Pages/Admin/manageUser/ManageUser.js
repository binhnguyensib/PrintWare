import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // Đảm bảo thư viện Chart.js tự động được thiết lập

import axios from 'axios';

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [loginFrequency, setLoginFrequency] = useState({});

  async function fetchUsersProfile() {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('Access token not found');
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/hcmut-sso/get-all-user-profiles`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        params: {
          userType: 'customer'
        }
      });

      setUsers(response.data.data);

      setLoginFrequency(response.data.data.reduce((acc, user) => {
        acc[user.userName] = user.loginCount;
        return acc;
      }, {}));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  // Giả lập fetch dữ liệu người dùng và tần suất đăng nhập
  useEffect(() => {
    fetchUsersProfile();
  }, []);

  // Chuẩn bị dữ liệu cho biểu đồ
  const chartData = {
    labels: Object.keys(loginFrequency),
    datasets: [
      {
        label: 'Login Frequency',
        data: Object.values(loginFrequency),
        backgroundColor: ['#007bff', '#28a745', '#ffc107'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box sx={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ marginBottom: '20px' }}>
        Manage Users
      </Typography>

      {/* Bảng danh sách người dùng */}
      <TableContainer component={Paper} sx={{ marginBottom: '40px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Email</b></TableCell>
              <TableCell><b>Phone</b></TableCell>
              <TableCell><b>Student ID</b></TableCell>
              <TableCell><b>Class</b></TableCell>
              <TableCell><b>Faculty</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.userId}>
                <TableCell>{user.userName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phoneNum}</TableCell>
                <TableCell>{user.hcmutId}</TableCell>
                <TableCell>{user.classId}</TableCell>
                <TableCell>{user.faculty}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Biểu đồ tần suất đăng nhập */}
      <Box sx={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <Typography variant="h6" sx={{ marginBottom: '20px', textAlign: 'center' }}>
          User Login Frequency
        </Typography>
        <Bar data={chartData} />
      </Box>
    </Box>
  );
};

export default ManageUser;
