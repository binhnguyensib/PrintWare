import express from 'express';
const router = express.Router();

import { updatePrinterInfo, takeDocList, addTask, removeTask, print } from '../../controllers/web_controllers/PrinterController.js';

router.put('/:printerId', async (req, res) => {
    const { printerId } = req.params;
    const newDetails = req.body;
  
    try {
      
      const result = await updatePrinterInfo(printerId, newDetails);
      res.status(200).json(result); 
    } catch (error) {
      
      if (error.message === "Invalid input") {
        res.status(400).json({ success: false, message: error.message });
      } else if (error.message === "Printer not found") {
        res.status(404).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  });
  
  router.get('/:printerId/doc-list', async (req, res) => {
    const { printerId } = req.params;
  
    try {
      const result = await takeDocList(printerId);
      res.status(200).json(result);
    } catch (error) {
      if (error.message === "Invalid input") {
        res.status(400).json({ success: false, message: error.message });
      } else if (error.message === "Printer not found") {
        res.status(404).json({ success: false, message: error.message });
      } else {
        console.error("Error in takeDocList:", error.message);
        res.status(500).json({ success: false, message: "An error occurred. Please try again later." });
      }
    }
  });
  
router.post('/:printerId/task', async (req, res) => {
  const { printerId } = req.params;
  const { taskId } = req.body;

  try {
    const result = await addTask(printerId, taskId);
    res.status(201).json(result);
  } catch (error) {
    if (error.message === "Invalid input data") {
      res.status(400).json({ success: false, message: error.message });
    } else if (error.message === "Printer not found") {
      res.status(404).json({ success: false, message: error.message });
    } else {
      res.status(500).json({ success: false, message: "An error occurred. Please try again later." });
    }
  }
});

router.delete('/:printerId/task/:taskId', async (req, res) => {
  const { printerId, taskId } = req.params;

  try {
    const result = await removeTask(printerId, taskId);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "Invalid input data") {
      res.status(400).json({ success: false, message: error.message });
    } else if (error.message === "Printer not found" || error.message === "Task not found in printer's job queue") {
      res.status(404).json({ success: false, message: error.message });
    } else {
      res.status(500).json({ success: false, message: "An error occurred. Please try again later." });
    }
  }
});

router.put('/task/:taskId/print', async (req, res) => {
  const { taskId } = req.params;

  try {
    const result = await print(taskId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});



export default router;
