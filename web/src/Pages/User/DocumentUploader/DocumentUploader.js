// Import React and necessary libraries
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";

// Importing the CSS file
import "./DocumentUploader.css";

const DocumentUploader = () => {
  const [documents, setDocuments] = useState([]);
  const [fileType, setFileType] = useState("all");
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const files = event.target.files;
    const newDocs = Array.from(files).map((file) => ({
      name: file.name,
      size: file.size,
    }));
    setDocuments((prevDocs) => [...prevDocs, ...newDocs]);
  };

  const handleTypeChange = (event, newType) => {
    if (newType !== null) setFileType(newType);
  };

  const filteredDocuments =
    fileType === "all"
      ? documents
      : fileType === "other"
      ? documents.filter(
          (doc) =>
            !doc.name.endsWith(".pdf") &&
            !doc.name.endsWith(".docx") &&
            !doc.name.endsWith(".txt")
        )
      : documents.filter((doc) => doc.name.endsWith(fileType));

  return (
    <Box className="document-uploader-container">
      <Box className="document-uploader-box">
        <Typography variant="h4" className="document-uploader-title">
          Upload Your Documents
        </Typography>

        <Box className="upload-controls">
          {/* Toggle button for file types */}
          <ToggleButtonGroup
            value={fileType}
            exclusive
            onChange={handleTypeChange}
            className="toggle-button-group"
          >
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value=".pdf">PDF</ToggleButton>
            <ToggleButton value=".docx">DOCX</ToggleButton>
            <ToggleButton value=".txt">TXT</ToggleButton>
            <ToggleButton value="other">Other</ToggleButton>
          </ToggleButtonGroup>

          <TextField
            type="file"
            inputProps={{ multiple: true }}
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="upload-input"
          />
          <label htmlFor="upload-input">
            <Button
              variant="contained"
              component="span"
              color="primary"
              startIcon={<UploadFileIcon />}
              className="upload-button"
            >
              Upload Files
            </Button>
          </label>
        </Box>

        <List className="document-list">
          {filteredDocuments.length === 0 ? (
            <Typography variant="body1" className="no-files-text">
              No documents uploaded.
            </Typography>
          ) : (
            filteredDocuments.map((doc, index) => (
              <React.Fragment key={index}>
                <ListItem className="document-list-item">
                  <ListItemText
                    primary={doc.name}
                    secondary={`Size: ${(doc.size / 1024).toFixed(2)} KB`}
                  />
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => {
                      const updatedDocs = documents.filter((_, i) => i !== index);
                      setDocuments(updatedDocs);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
                {index < filteredDocuments.length - 1 && <Divider />}
              </React.Fragment>
            ))
          )}
        </List>

        <Button
          variant="contained"
          color="primary"
          disabled={documents.length === 0}
          onClick={() => navigate("/documents", { state: { documents } })}
          className="confirm-button"
        >
          Confirm Upload
        </Button>
      </Box>
    </Box>
  );
};

export default DocumentUploader;