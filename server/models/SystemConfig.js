export default class SystemConfig {
    constructor() {
        this.pageUnitPrice = 0;
        this.pageSizes = [];
        this.pageTypes = [];
        this.defaultPrintConfig = {};
        this.nextLogDate = new Date();
    }

    // Chuyển đối tượng thành JSON
    convertToJson() {
        return {
            pageUnitPrice: this.pageUnitPrice,
            pageSizes: this.pageSizes,
            pageTypes: this.pageTypes,
            defaultPrintConfig: this.defaultPrintConfig,
            nextLogDate: this.nextLogDate
        };
    }

    // Khởi tạo đối tượng từ JSON
    setInfoFromJson(jsonData) {
        this.pageUnitPrice = jsonData.pageUnitPrice || 0;
        this.pageSizes = jsonData.pageSizes || [];
        this.pageTypes = jsonData.pageTypes || [];
        this.defaultPrintConfig = jsonData.defaultPrintConfig || {};
        this.nextLogDate = jsonData.nextLogDate ? new Date(jsonData.nextLogDate) : new Date();
    }

    // Lấy dữ liệu từ Firestore và khởi tạo đối tượng
    static async getConfigById(configId, db) {
        try {
            const ref = db.collection('SystemConfig').doc(configId);
            const doc = await ref.get();


            if (!doc.exists) {
                throw new Error(`Không tìm thấy cấu hình với ID: ${configId}`);
            }


            const config = new SystemConfig();
            config.setInfoFromJson(doc.data());
            return config;
        } catch (error) {
            console.error('Lỗi khi lấy cấu hình:', error.message);
            throw error;
        }
    }
}