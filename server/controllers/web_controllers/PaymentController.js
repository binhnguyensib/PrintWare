import { v4 as uuidv4 } from "uuid";
import Payment from "../../models/Payment.js";
import WalletController from "./WalletController.js";
import MoMoPaymentGateway from "../../services/MoMoPaymentGateway.js";
import { firestore } from "../../services/FirebaseAdminSDK.js";

// Tạo thanh toán mới
export const createPayment = async (userId, amount) => {
  try {
    const transactionId = uuidv4();
    const createAt = new Date().toISOString();
    const status = "PENDING"; // Ban đầu trạng thái thanh toán là PENDING
    const paymentMethod = "MoMo"; // Tạm thời chỉ hỗ trợ thanh toán qua MoMo

    const payment = new Payment(transactionId, userId, amount, status, paymentMethod, createAt);

    // Lưu thông tin thanh toán vào Firestore
    await firestore.collection("payments").doc(transactionId).set(payment.convertToJson());

    // Kích hoạt thanh toán qua MoMo
    const paymentUrl = await MoMoPaymentGateway.initiatePayment(transactionId, amount);
    return { success: true, paymentUrl }; // Trả về URL để người dùng thanh toán
  } catch (error) {
    throw new Error(`Không thể tạo thanh toán: ${error.message}`);
  }
};

// Cập nhật trạng thái thanh toán
export const updatePaymentStatus = async (transactionId, status) => {
  try {
    // Lấy thông tin thanh toán
    const paymentDoc = await firestore.collection("payments").doc(transactionId).get();
    if (!paymentDoc.exists) throw new Error("Không tìm thấy giao dịch.");

    const paymentData = paymentDoc.data();
    const payment = new Payment();
    payment.setInfoFromJson(paymentData);

    // Cập nhật trạng thái
    payment.status = status;

    // Lưu trạng thái mới vào Firestore
    await firestore.collection("payments").doc(transactionId).update({ status });

    // Nếu thanh toán thành công, xử lý logic thêm trang vào ví
    if (status === "SUCCESS") {
      const pagesToAdd = calculatePagesFromAmount(payment.amount);
      await WalletController.addPagesToWallet(payment.ownerId, pagesToAdd);
    }
  } catch (error) {
    throw new Error(`Không thể cập nhật trạng thái thanh toán: ${error.message}`);
  }
};

// Lấy thông tin chi tiết giao dịch
export const getPaymentDetails = async (transactionId) => {
  try {
    const paymentDoc = await firestore.collection("payments").doc(transactionId).get();
    if (!paymentDoc.exists) throw new Error("Không tìm thấy giao dịch.");

    return paymentDoc.data();
  } catch (error) {
    throw new Error(`Không thể lấy thông tin giao dịch: ${error.message}`);
  }
};

// Bổ sung hàm mới nhưng mà chưa biết có dùng không :"))) Tính số trang được mua dựa trên số tiền
const calculatePagesFromAmount = (amount) => {
  const costPerPage = 500; // Giả định mỗi trang giá 500VND theo giá thị trường nha
  return Math.floor(amount / costPerPage);
};
