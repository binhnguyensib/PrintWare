import React, { useState } from 'react';
import { Box, Typography, Button, Modal, TextField, Switch } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Component hiển thị từng máy in
const PrinterItem = ({ printer, toggleStatus, onDetailsClick }) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="space-between"
    marginBottom="10px"
    padding="10px"
    border="1px solid #ccc"
  >
    <img
      src={printer.image} // Lấy ảnh của máy in từ props
      alt={printer.name}
      style={{ width: '50px', cursor: 'pointer' }}
      onClick={() => onDetailsClick(printer)}
    />
    <Typography>{printer.name}</Typography>
    <Switch
      checked={printer.status}
      onChange={() => toggleStatus(printer.id)}
    />
  </Box>
);

const ManagePrinter = () => {
  const navigate = useNavigate();

  const [printers, setPrinters] = useState([
    { id: 1, name: 'Printer 1', status: true, manufacturer: 'HP', history: ['Print Job 1', 'Print Job 2'], image: '/images/printer1.jpg' },
    { id: 2, name: 'Printer 2', status: false, manufacturer: 'Canon', history: [], image: '/images/printer2.jpg' },
  ]);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [newPrinter, setNewPrinter] = useState({ name: '', id: '', manufacturer: '', image: '' });
  const [selectedPrinter, setSelectedPrinter] = useState(null);

  // Placeholder images for new printers
  const placeholderImages = [
    '/images/printer1.jpg',
    '/images/printer2.jpg',
    '/images/printer3.jpg',
  ];

  // Function to get a random image for new printer
  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * placeholderImages.length);
    return placeholderImages[randomIndex];
  };

  // Thêm máy in mới
  const handleAddPrinter = () => {
    setPrinters([...printers, { ...newPrinter, status: false, history: [], image: getRandomImage() }]);
    setNewPrinter({ name: '', id: '', manufacturer: '', image: '' });
    setOpenAddModal(false);
  };

  // Bật/tắt trạng thái máy in
  const toggleStatus = (id) => {
    setPrinters(printers.map((printer) =>
      printer.id === id ? { ...printer, status: !printer.status } : printer
    ));
  };

  // Mở modal chi tiết máy in
  const handleOpenDetails = (printer) => {
    setSelectedPrinter(printer);
  };

  // Đóng modal chi tiết máy in
  const handleCloseDetails = () => {
    setSelectedPrinter(null);
  };

  // Phân loại máy in Online/Offline
  const onlinePrinters = printers.filter((printer) => printer.status);
  const offlinePrinters = printers.filter((printer) => !printer.status);

  return (
    <Box sx={{ marginTop: '50px', height: '100vh' }}>
      <Typography variant="h4">Manage Printer</Typography>

      {/* Nút thêm máy in */}
      <Button onClick={() => setOpenAddModal(true)} variant="contained" style={{ margin: '20px 0' }}>
        Add Printer
      </Button>

      {/* Danh sách máy in Online */}
      <Typography variant="h5">Online Printers</Typography>
      {onlinePrinters.map((printer) => (
        <PrinterItem
          key={printer.id}
          printer={printer}
          toggleStatus={toggleStatus}
          onDetailsClick={handleOpenDetails}
        />
      ))}

      {/* Danh sách máy in Offline */}
      <Typography variant="h5" style={{ marginTop: '20px' }}>Offline Printers</Typography>
      {offlinePrinters.map((printer) => (
        <PrinterItem
          key={printer.id}
          printer={printer}
          toggleStatus={toggleStatus}
          onDetailsClick={handleOpenDetails}
        />
      ))}

      {/* Modal thêm máy in */}
      <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <Box style={{ padding: '20px', backgroundColor: '#fff', margin: '100px auto', width: '300px' }}>
          <Typography variant="h6">Add Printer</Typography>
          <TextField
            label="Printer Name"
            fullWidth
            value={newPrinter.name}
            onChange={(e) => setNewPrinter({ ...newPrinter, name: e.target.value })}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            label="Printer ID"
            fullWidth
            value={newPrinter.id}
            onChange={(e) => setNewPrinter({ ...newPrinter, id: e.target.value })}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            label="Manufacturer"
            fullWidth
            value={newPrinter.manufacturer}
            onChange={(e) => setNewPrinter({ ...newPrinter, manufacturer: e.target.value })}
            style={{ marginBottom: '10px' }}
          />
          <Box sx={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <Button variant="contained" fullWidth onClick={handleAddPrinter}>
              Add
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#ff0004',
                color: '#fff',
                '&:hover': { backgroundColor: '#cc0003' },
              }}
              fullWidth
              onClick={() => setOpenAddModal(false)}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal hiển thị chi tiết máy in */}
      <Modal open={!!selectedPrinter} onClose={handleCloseDetails}>
        <Box style={{ padding: '20px', backgroundColor: '#fff', margin: '100px auto', width: '400px' }}>
          <Typography variant="h6">{selectedPrinter?.name}</Typography>
          <Typography>ID: {selectedPrinter?.id}</Typography>
          <Typography>Status: {selectedPrinter?.status ? 'Online' : 'Offline'}</Typography>
          <Typography>Manufacturer: {selectedPrinter?.manufacturer || 'N/A'}</Typography>
          <img src={selectedPrinter?.image} alt={selectedPrinter?.name} style={{ width: '100%', marginTop: '20px' }} />
          <Typography variant="h6" style={{ marginTop: '20px' }}>Print History:</Typography>
          <ul>
            {selectedPrinter?.history?.length ? (
              selectedPrinter.history.map((entry, index) => <li key={index}>{entry}</li>)
            ) : (
              <Typography>No print history available</Typography>
            )}
          </ul>
        </Box>
      </Modal>

      {/* Nút chuyển tới màn hình khác */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/manage-configuration')}
        style={{ marginTop: '20px' }}
      >
        Go to Manage Config
      </Button>
    </Box>
  );
};

export default ManagePrinter;