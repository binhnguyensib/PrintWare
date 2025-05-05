import PaymentProcessorInterface from "../interfaces/PaymentProcessorInterface.js";
import axios from "axios"; // Dùng để gọi API đến MoMo
import crypto from "crypto"; // Dùng để tạo chữ ký điện tử

class MoMoPaymentGateway extends PaymentProcessorInterface {
  constructor() {
    super();
    this.partnerCode = "MOMO_PARTNER_CODE"; 
    this.accessKey = "MOMO_ACCESS_KEY"; 
    this.secretKey = "MOMO_SECRET_KEY"; // Chưa tạo ví nên nguyên cái này chưa có thực
    this.endpoint = "https://test-payment.momo.vn/v2/gateway/api/create"; 
    this.callbackUrl = "https://domain.com/payment/callback"; 
  }

  /**
   * Khởi tạo giao dịch thanh toán.
   * @param {string} transactionId - ID giao dịch duy nhất.
   * @param {number} amount - Số tiền giao dịch.
   * @returns {Promise<string>} - URL để người dùng thực hiện thanh toán.
   */
  async initiateTransaction(transactionId, amount) {
    try {
      const orderDetails = {
        partnerCode: this.partnerCode,
        accessKey: this.accessKey,
        requestId: transactionId,
        orderId: transactionId,
        amount: amount,
        orderInfo: "Mua thêm số trang in",
        redirectUrl: this.callbackUrl,
        ipnUrl: this.callbackUrl,
        requestType: "captureWallet",
      };

      // Tạo chữ ký bảo mật
      const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&ipnUrl=${this.callbackUrl}&orderId=${transactionId}&orderInfo=Mua thêm số trang in&partnerCode=${this.partnerCode}&redirectUrl=${this.callbackUrl}&requestId=${transactionId}&requestType=captureWallet`;
      const signature = this.generateSignature(rawSignature);

      // Thêm chữ ký vào request body
      orderDetails.signature = signature;

      // Gửi yêu cầu tới MoMo
      const response = await axios.post(this.endpoint, orderDetails);

      if (response.data && response.data.payUrl) {
        return response.data.payUrl; // Trả về URL để người dùng thanh toán
      } else {
        throw new Error("Không nhận được URL thanh toán từ MoMo.");
      }
    } catch (error) {
      throw new Error(`Lỗi khi khởi tạo giao dịch MoMo: ${error.message}`);
    }
  }

  /**
   * Xác minh giao dịch thông qua transactionId.
   * @param {string} transactionId - ID giao dịch.
   * @returns {Promise<boolean>} - Trả về true nếu giao dịch hợp lệ, ngược lại false.
   */
  async verifyTransaction(transactionId) {
    try {
      // Gọi API 
      const paymentDetails = await this.getPaymentDetailsFromMoMo(transactionId);
      return paymentDetails && paymentDetails.resultCode === 0; // 0 = Giao dịch thành công
    } catch (error) {
      console.error(`Lỗi xác minh giao dịch MoMo: ${error.message}`);
      return false;
    }
  }

  /**
   * Xử lý callback từ MoMo.
   * @param {Object} callbackData - Dữ liệu callback từ MoMo.
   */
  async handleCallback(callbackData) {
    try {
      const { orderId, resultCode } = callbackData;
      const status = resultCode === 0 ? "SUCCESS" : "FAILED";
      await this.updateTransactionStatus(orderId, status);
      if (status === "SUCCESS") {
        await this.onPaymentSuccess(orderId);}
    } catch (error) {
      console.error(`Lỗi xử lý callback MoMo: ${error.message}`);
    }
  }

  /**
   * Tạo chữ ký điện tử cho giao dịch.
   * @param {string} rawSignature - Chuỗi cần tạo chữ ký.
   * @returns {string} - Chữ ký hợp lệ.
   */
  generateSignature(rawSignature) {
    return crypto.createHmac("sha256", this.secretKey).update(rawSignature).digest("hex");
  }

  /**
   * Lấy thông tin giao dịch từ MoMo.
   * @param {string} transactionId - ID giao dịch.
   * @returns {Object} - Chi tiết giao dịch từ MoMo.
   */
  async getPaymentDetailsFromMoMo(transactionId) {
    try {
      const details = await axios.get(`https://test-payment.momo.vn/v2/gateway/api/query?partnerCode=${this.partnerCode}&accessKey=${this.accessKey}&orderId=${transactionId}&signature=${this.generateSignature(`accessKey=${this.accessKey}&orderId=${transactionId}`)}`);
      return details.data;
    } catch (error) {
      throw new Error(`Không thể lấy thông tin giao dịch từ MoMo: ${error.message}`);
    }
  }

  /**
   * Cập nhật trạng thái giao dịch
   * @param {string} transactionId - ID giao dịch.
   * @param {string} status - Trạng thái giao dịch mới.
   */
  async updateTransactionStatus(transactionId, status) {
    try {
      console.log(`Cập nhật giao dịch ${transactionId} thành trạng thái ${status}`);
    } catch (error) {
      console.error(`Không thể cập nhật trạng thái giao dịch ${transactionId}: ${error.message}`);
    }
  }
  /**
   * Thực hiện các bước sau khi thanh toán thành công
   * @param {string} transactionId - ID giao dịch.
   */
  async onPaymentSuccess(transactionId) {
    console.log(`Thanh toán ${transactionId} đã thành công. Cập nhật ví người dùng.`);
  }

  convertToJson() {
    return {
      endpoint: this.endpoint,
      partnerCode: this.partnerCode,
      accessKey: this.accessKey,
      redirectUrl: this.callbackUrl,
      ipnUrl: this.callbackUrl,
    };
  }
  setInfoFromJson(json) {
    this.endpoint = json.endpoint;
    this.partnerCode = json.partnerCode;
    this.accessKey = json.accessKey;
    this.callbackUrl = json.redirectUrl;
    this.callbackUrl = json.ipnUrl;
  }
}

export default new MoMoPaymentGateway();
