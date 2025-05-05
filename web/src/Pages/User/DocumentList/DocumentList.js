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
  Checkbox,
  IconButton,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import "./DocumentList.css";

const DocumentList = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = React.useState([
    { name: "policy.pdf", size: "20 MB" },
    { name: "tailieu.docx", size: "15 MB" },
  ]);
  const [selectedDocs, setSelectedDocs] = React.useState([]);

  const handleToggleSelect = (index) => {
    setSelectedDocs((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((i) => i !== index)
        : [...prevSelected, index]
    );
  };

  const handleDelete = (index) => {
    setDocuments((prevDocs) => prevDocs.filter((_, i) => i !== index));
    setSelectedDocs((prevSelected) => prevSelected.filter((i) => i !== index));
  };

  const handleAddDocument = () => {
    navigate("/document-uploader");
  };

  const handleNext = () => {
    navigate("/order");
  };

  return (
    <Box className="document-list-container">
      <Box className="document-list-box">
        <Typography variant="h4" className="document-list-title">
          Document List
        </Typography>
        <TableContainer className="table-container">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" className="table-header-cell">
                  Select
                </TableCell>
                <TableCell className="table-header-cell">Document Name</TableCell>
                <TableCell align="right" className="table-header-cell">
                  Size
                </TableCell>
                <TableCell align="center" className="table-header-cell">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.map((doc, index) => (
                <TableRow key={index}>
                  <TableCell align="center">
                    <Checkbox
                      checked={selectedDocs.includes(index)}
                      onChange={() => handleToggleSelect(index)}
                    />
                  </TableCell>
                  <TableCell>{doc.name}</TableCell>
                  <TableCell align="right">{doc.size}</TableCell>
                  <TableCell align="center">
                    <IconButton color="error" onClick={() => handleDelete(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box className="button-container">
          <Button
            variant="contained"
            color="secondary"
            onClick={handleAddDocument}
          >
            Add Document
          </Button>
          <Button variant="contained" color="primary" onClick={handleNext}>
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default DocumentList;
