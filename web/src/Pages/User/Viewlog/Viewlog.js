import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";

const DocumentHistory = () => {
  const navigate = useNavigate();

  // Mock data for documents
  const [documents, setDocuments] = React.useState([
    {
      name: "Document 1",
      location: "Hanoi",
      printTime: "2024-11-01 10:30 AM",
      receiveTime: "2024-11-01 11:00 AM",
      price: 50000, // Giá tiền in
    },
    {
      name: "Document 2",
      location: "Ho Chi Minh City",
      printTime: "2024-11-02 03:45 PM",
      receiveTime: "2024-11-02 04:15 PM",
      price: 75000, // Giá tiền in
    },
    {
      name: "Document 3",
      location: "Da Nang",
      printTime: "2024-11-03 09:00 AM",
      receiveTime: "2024-11-03 09:30 AM",
      price: 60000, // Giá tiền in
    },
  ]);

  // Delete a document
  const handleDelete = (index) => {
    setDocuments((prevDocs) => prevDocs.filter((_, i) => i !== index));
  };

  // Navigate to detail page
  const handleViewDetails = (index) => {
    navigate(`/document-details/${index}`, { state: documents[index] });
  };

  return (
    <Box
      sx={{
        padding: "20px",
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        sx={{ textAlign: "center", marginBottom: "20px", fontWeight: "bold" }}
      >
        Document Printing History
      </Typography>
      <TableContainer component={Paper} sx={{ maxWidth: "1000px", margin: "0 auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Document Name</strong></TableCell>
              <TableCell><strong>Location</strong></TableCell>
              <TableCell><strong>Print Time</strong></TableCell>
              <TableCell><strong>Receive Time</strong></TableCell>
              <TableCell><strong>Price</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((doc, index) => (
              <TableRow key={index}>
                <TableCell>{doc.name}</TableCell>
                <TableCell>{doc.location}</TableCell>
                <TableCell>{doc.printTime}</TableCell>
                <TableCell>{doc.receiveTime}</TableCell>
                <TableCell>{doc.price.toLocaleString()} VND</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="info"
                    onClick={() => handleViewDetails(index)}
                    title="View Details"
                  >
                    <InfoIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(index)}
                    title="Delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DocumentHistory;