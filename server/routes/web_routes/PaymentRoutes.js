import express from "express";
import multer from "multer";
import { createPayment, updatePaymentStatus, getPaymentDetails } from "./controllers/web_controllers/PaymentController.js";
import MoMoPaymentGateway from "../../services/MoMoPaymentGateway.js";
import { authMiddleware } from "./middlewares/authentication.js";  // Thêm middleware authMiddleware

const router = express.Router();

// Cấu hình multer
const upload = multer({ dest: 'uploads/' });

// Route GET: Lấy chi tiết giao dịch thanh toán
router.get("/payment/:transactionId", authMiddleware, async (req, res) => {
  try {
    const { transactionId } = req.params;
    const paymentDetails = await getPaymentDetails(transactionId);
    res.status(200).json({ success: true, data: paymentDetails });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route POST: Tạo thanh toán mới
router.post("/payment", upload.none(), authMiddleware, async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin userId hoặc amount." });
    }

    // Tạo thanh toán thông qua controller và MoMoPaymentGateway
    const { success, paymentUrl } = await createPayment(userId, amount);
    if (success) {
      res.status(201).json({ success: true, paymentUrl });
    } else {
      res.status(500).json({ success: false, message: "Không thể tạo thanh toán." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route PUT: Cập nhật trạng thái thanh toán
router.put("/payment/:transactionId", upload.none(), authMiddleware, async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "Trạng thái không hợp lệ." });
    }

    // Cập nhật trạng thái thanh toán
    await updatePaymentStatus(transactionId, status);
    res.status(200).json({ success: true, message: `Trạng thái thanh toán ${status} thành công.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route POST: Xử lý callback từ MoMo sau khi thanh toán
router.post("/payment/callback", async (req, res) => {
  try {
    const callbackData = req.body;
    // Xử lý callback từ MoMo để cập nhật trạng thái thanh toán
    await MoMoPaymentGateway.handleCallback(callbackData);
    res.status(200).json({ success: true, message: "Xử lý callback thành công." });
  } catch (error) {
    res.status(500).json({ success: false, message: `Lỗi xử lý callback: ${error.message}` });
  }
});

export default router;
