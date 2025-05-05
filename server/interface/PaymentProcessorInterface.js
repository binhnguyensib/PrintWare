export default class PaymentProcessorInterface {
    /**
     * Khởi tạo giao dịch thanh toán.
     * @param {any} ownerId - ID của người dùng thực hiện giao dịch.
     * @param {any} amount - Số tiền giao dịch.
     * @throws {Error} Nếu phương thức không được hiện thực.
     */
    initiateTransaction(userId, amount) {
      throw new Error("Method 'initiateTransaction' must be implemented.");
    }
  
    /**
     * Xác minh giao dịch thông qua ID giao dịch.
     * @param {any} transactionId - ID của giao dịch cần xác minh.
     * @returns {boolean} - Trả về true nếu giao dịch hợp lệ, ngược lại false.
     * @throws {Error} Nếu phương thức không được hiện thực.
     */
    verifyTransaction(transactionId) {
      throw new Error("Method 'verifyTransaction' must be implemented.");
    }
  
    /**
     * Xử lý callback từ cổng thanh toán.
     * @param {Object} callbackData - Dữ liệu callback từ cổng thanh toán.
     * @throws {Error} Nếu phương thức không được hiện thực.
     */
    handleCallback(callbackData) {
      throw new Error("Method 'handleCallback' must be implemented.");
    }

    convertToJson() {
      throw new Error("Method 'convertToJson' must be implemented.");
    }
  
    setInfoFromJson(json) {
      throw new Error("Method 'setInfoFromJson' must be implemented.");
    }
  }
  