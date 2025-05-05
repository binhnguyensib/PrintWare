import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import axios from "axios";
import { SPSOModelKeys } from "../../../models/User";

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);

  async function fetchUsersProfile() {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('Access token not found');
      return false;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/hcmut-sso/get-all-user-profiles`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        params: {
          userType: 'spso'
        }
      }); 

      setEmployees(response.data.data);

      return true;
    } catch (error) {
      console.error('Error fetching users:', error);
      return false;
    }
  }

  useEffect(() => {
    fetchUsersProfile();
  }, []);

  const chartRef = useRef(null); // Tham chiếu biểu đồ

  // Dữ liệu cho biểu đồ
  const loginData = {
    labels: employees.map((emp) => emp.userName),
    datasets: [
      {
        label: "Login Counts",
        data: employees.map((emp) => emp.loginCount),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Employees",
        },
      },
      y: {
        title: {
          display: true,
          text: "Login Count",
        },
        beginAtZero: true,
      },
    },
  };

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedEmployee(null);
  };

  async function fetchAccountEditData(employeeData) {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('Access token not found');
      return false;
    }
    const userId = employeeData.userId;
    if (!userId) {
      console.error('User ID not found');
      return false;
    }
    const userRole = employeeData.userRole;
    if (!userRole) {
      console.error('User role not found');
      return false;
    }

    try {
      const formData = new FormData();
      formData.append(SPSOModelKeys.userId, userId);
      formData.append(SPSOModelKeys.userRole, userRole);
      if (employeeData.employeeId) formData.append(SPSOModelKeys.employeeId, employeeData.employeeId);
      if (employeeData.userName) formData.append(SPSOModelKeys.userName, employeeData.userName);
      if (employeeData.email) formData.append(SPSOModelKeys.email, employeeData.email);
      if (employeeData.address) formData.append(SPSOModelKeys.address, employeeData.address);
      if (employeeData.lastLogin) formData.append(SPSOModelKeys.lastLogin, employeeData.lastLogin);
      if (employeeData.loginCount) formData.append(SPSOModelKeys.loginCount, employeeData.loginCount);

      const response = await axios.patch(`${process.env.REACT_APP_SERVER_URL}/hcmut-sso/update-profile`, formData, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${accessToken}`
        },
        params: {
          userId: userId,
          userRole: userRole
        }
      });

      console.log('Update\'s response: ', response.data);

      return true;
    } catch (error) {
      console.error('Error fetching users:', error);
      return false;
    };
  };

  const handleSaveChanges = () => {
    fetchAccountEditData(selectedEmployee).then((result) => {
      if (result) {
        console.log('Data updated successfully');
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.id === selectedEmployee.id ? { ...selectedEmployee } : emp
          )
        );
        handleCloseDialog();
      }
      else {
        console.log('Failed to update data');
        handleCloseDialog();
      }
    }).catch((error) => {
      console.error('Error updating data:', error);
      handleCloseDialog();
    });
  };

  async function fetchDeleteAccount(userId) {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('Access token not found');
      return false;
    }
    if (!userId) {
      console.error('User ID not found');
      return false;
    }

    const userRole = employees.find((emp) => emp.userId === userId).userRole;
    if (!userRole) {
      console.error('User role not found');
      return false;
    }

    try {
      const response = await axios.delete(`${process.env.REACT_APP_SERVER_URL}/hcmut-sso/delete-account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        params: {
          userId: userId,
          userRole: userRole
        }
      });

      console.log('Delete\'s response: ', response.data);

      return true;
    } catch (error) {
      console.error('Error fetching users:', error);
      return false;
    }
  };

  const handleDelete = (id) => {
    console.log('Delete account:', id);
    fetchDeleteAccount(id).then((result) => {
      if (result) {
        console.log('Data deleted successfully');
        setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      }
      else {
        console.log('Failed to delete data');
      }
    }).catch((error) => {
      console.error('Error deleting data:', error);
    });
  };

  return (
    <Box
      sx={{
        padding: "20px",
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" sx={{ mb: 3 }}>
        Employee Management
      </Typography>

      {/* Bảng nhân viên */}
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Employee ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Last Login Time</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((emp) => (
              <TableRow key={emp.userId}>
                <TableCell>{emp.userId}</TableCell>
                <TableCell>{emp.employeeId}</TableCell>
                <TableCell>{emp.userName}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>{emp.address}</TableCell>
                <TableCell>{emp.lastLogin}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(emp)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(emp.userId)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Biểu đồ thống kê */}
      <Box sx={{ mb: 4, height: "400px", width: "800px", textAlign: 'center', margin: 'auto' }}>
        <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
          Login Statistics
        </Typography>
        <Bar ref={chartRef} data={loginData} options={chartOptions} />
      </Box>

      {/* Dialog chỉnh sửa */}
      {selectedEmployee && (
        <Dialog open={isEditDialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Edit Employee</DialogTitle>
          <DialogContent>
            <TextField
              label="Employee ID"
              value={selectedEmployee.employeeId}
              onChange={(e) =>
                setSelectedEmployee({
                  ...selectedEmployee,
                  employeeId: e.target.value,
                })
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Name"
              value={selectedEmployee.userName}
              onChange={(e) =>
                setSelectedEmployee({
                  ...selectedEmployee,
                  userName: e.target.value,
                })
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email"
              value={selectedEmployee.email}
              onChange={(e) =>
                setSelectedEmployee({
                  ...selectedEmployee,
                  email: e.target.value,
                })
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Address"
              value={selectedEmployee.address}
              onChange={(e) =>
                setSelectedEmployee({
                  ...selectedEmployee,
                  address: e.target.value,
                })
              }
              fullWidth
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSaveChanges} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default AdminDashboard;
