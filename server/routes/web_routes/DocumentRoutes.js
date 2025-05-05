import { Router } from "express";
const router = Router();

import {
  uploadDoc,
  deleteDoc,
  takeDocList,
  getDoc,
  createPrintTask,
} from "../../controllers/web_controllers/DocumentController.js";

import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/uploadDoc", upload.single("file"), async (req, res) => {
  try {
    const { ownerId, description } = req.body;
    const file = req.file;

    const response = await uploadDoc(file, ownerId, description);

    res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete("/deleteDoc", async (req, res) => {
  try {
    const documentId = req.body.docId;
    const response = await deleteDoc(documentId);

    res.status(200).json(response);
  } catch (error) {
    console.error("Lỗi trong việc xóa tài liệu: ", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});
router.get("/takeDocList", async (req, res) => {
  try {
    const { ownerId } = req.query;

    const response = await takeDocList(ownerId);

    res.status(200).json(response);
  } catch (error) {
    console.error("Lỗi trong việc lấy danh sách tài liệu của sinh viên: ", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/getDoc", async (req, res) => {
  try {
    const { documentId } = req.query;

    const response = await getDoc(documentId);
    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("Lỗi khi lấy tài liệu:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/printTask", async(req, res) => {
  try {
    const { documentId, roomId } = req.body;

    const response = await createPrintTask(documentId, roomId);

    res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error("Tạo task in thất bại:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
