import { Router } from "express";
import multer from "multer";
import {
  createWallet,
  addPagesToWallet,
  getWallet,
  checkBalance,
  deductPages,
} from "../../controllers/web_controllers/WalletController.js";

const router = Router();
const upload = multer(); // Middleware của Multer để xử lý form-data

// Tạo ví mới
router.post("/createWallet", upload.none(), async (req, res) => {
  try {
    const { walletId, ownerId } = req.body;
    const wallet = await createWallet(walletId, ownerId, new Date().toISOString());
    res.status(201).json({ success: true, data: wallet });
  } catch (error) {
    console.error("Lỗi khi tạo ví:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Thêm số trang vào ví
router.post("/addPages", upload.none(), async (req, res) => {
  try {
    const { walletId, pages } = req.body;
    const updatedWallet = await addPagesToWallet(walletId, pages);
    res.status(200).json({ success: true, data: updatedWallet });
  } catch (error) {
    console.error("Lỗi khi thêm số trang:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Lấy thông tin ví
router.get("/getWallet", async (req, res) => {
  try {
    const { walletId } = req.query;
    const wallet = await getWallet(walletId);
    res.status(200).json({ success: true, data: wallet });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin ví:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Kiểm tra số dư trang in
router.get("/checkBalance", async (req, res) => {
  try {
    const { walletId, requiredPages } = req.query;
    const hasEnoughPages = await checkBalance(walletId, requiredPages);
    res.status(200).json({ success: true, data: { hasEnoughPages } });
  } catch (error) {
    console.error("Lỗi khi kiểm tra số dư:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Trừ số trang từ ví
router.post("/deductPages", upload.none(), async (req, res) => {
  try {
    const { walletId, pages } = req.body;
    const updatedWallet = await deductPages(walletId, pages);
    res.status(200).json({ success: true, data: updatedWallet });
  } catch (error) {
    console.error("Lỗi khi trừ số trang:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
