export default class HistoryLog {
    constructor() {
        this.hisLogId = "";
        this.ownerId = "";
        this.paymentRepo = [];
        this.printedDocRepo = [];
    }

    // Chuyển thông tin đối tượng thành JSON
    convertToJson() {
        return {
            hisLogId: this.hisLogId,
            ownerId: this.ownerId,
            paymentRepo: this.paymentRepo,
            printedDocRepo: this.printedDocRepo
        };
    }

    // Lấy thông tin từ JSON và gán giá trị cho đối tượng
    setInfoFromJson(json) {
        this.hisLogId = json.hisLogId || "";
        this.ownerId = json.ownerId || "";
        this.paymentRepo = json.paymentRepo || [];
        this.printedDocRepo = json.printedDocRepo || [];
    }
}