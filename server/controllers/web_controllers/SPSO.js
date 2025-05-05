import { firestore } from '../../services/FirebaseAdminSDK.js';
import HistoryLog from '../../models/HistoryLog.js';
// Trang chào
export const index = async () => {
    return 'Xin chào! Đây là hệ thống quản lý SPSO.';
};

// Cập nhật giá tiền trên mỗi trang
export const updatePageUnitPrice = async ({ configId, pageUnitPrice }) => {
    try {
        // Kiểm tra thông tin đầu vào
        if (!configId || !pageUnitPrice) {
            throw new Error('Thiếu thông tin configId hoặc pageUnitPrice');
        }

        const ref = firestore.collection(process.env.SYSTEM_CONFIGS_COLLECTION).doc(configId);
        const doc = await ref.get();
        if (!doc.exists) {
            throw new Error(`Không tìm thấy cấu hình với ID: ${configId}. Hãy kiểm tra lại ID hoặc tạo cấu hình mới.`);
        }
        // Cập nhật giá trị pageUnitPrice
        await ref.update({ pageUnitPrice });
        return 'Cập nhật pageUnitPrice thành công';
    } catch (error) {
        console.error('Lỗi khi cập nhật pageUnitPrice:', error.message);
        throw new Error(`Không thể cập nhật pageUnitPrice: ${error.message}`);
    }
};

// Cập nhật kích thước trang
export const updatePageSizes = async ({ configId, pageSizes }) => {
    try {
        if (!configId || !Array.isArray(pageSizes)) {
            throw new Error('Thiếu thông tin configId hoặc pageSizes không hợp lệ');
        }

        const ref = firestore.collection(process.env.SYSTEM_CONFIGS_COLLECTION).doc(configId);
        const doc = await ref.get();

        if (!doc.exists) {
            throw new Error(`Không tìm thấy cấu hình với id: ${configId}`);
        }

        await ref.update({ pageSizes });
        return 'Cập nhật pageSizes thành công';
    } catch (error) {
        console.error('Lỗi khi cập nhật pageSizes:', error.message);
        throw new Error(`Không thể cập nhật pageSizes: ${error.message}`);
    }
};

// Cập nhật cấu hình in mặc định
export const updateDefaultPrintConfig = async ({ configId, defaultPrintConfig }) => {
    try {
        if (!configId || typeof defaultPrintConfig !== 'object') {
            throw new Error('Thiếu thông tin configId hoặc defaultPrintConfig không hợp lệ');
        }

        const ref = firestore.collection(process.env.SYSTEM_CONFIGS_COLLECTION).doc(configId);
        const doc = await ref.get();

        if (!doc.exists) {
            throw new Error(`Không tìm thấy cấu hình với id: ${configId}`);
        }

        await ref.update({ defaultPrintConfig });
        return 'Cập nhật defaultPrintConfig thành công';
    } catch (error) {
        console.error('Lỗi khi cập nhật defaultPrintConfig:', error.message);
        throw new Error(`Không thể cập nhật defaultPrintConfig: ${error.message}`);
    }
};

// Cập nhật ngày log tiếp theo
export const updateNextLogDate = async ({ configId, nextLogDate }) => {
    try {
        if (!configId || !nextLogDate) {
            throw new Error('Thiếu thông tin configId hoặc nextLogDate');
        }

        const parsedDate = new Date(nextLogDate);
        if (isNaN(parsedDate.getTime())) {
            throw new Error('nextLogDate không hợp lệ');
        }

        const ref = firestore.collection(process.env.SYSTEM_CONFIGS_COLLECTION).doc(configId);
        const doc = await ref.get();

        if (!doc.exists) {
            throw new Error(`Không tìm thấy cấu hình với id: ${configId}`);
        }

        await ref.update({ nextLogDate: parsedDate });
        return 'Cập nhật nextLogDate thành công';
    } catch (error) {
        console.error('Lỗi khi cập nhật nextLogDate:', error.message);
        throw new Error(`Không thể cập nhật nextLogDate: ${error.message}`);
    }
};

// Lấy thông tin máy in
export const getPrinter = async (printerId) => {
    try {
        const doc = await firestore.collection('Printers').doc(printerId).get();
        if (!doc.exists) {
            console.error(`Máy in với id ${printerId} không tồn tại.`);
            return null;
        }
        return { id: doc.id, ...doc.data() };
    } catch (error) {
        console.error('Lỗi khi lấy thông tin máy in:', error.message);
        throw new Error('Đã xảy ra lỗi khi truy xuất thông tin máy in');
    }
};

// Thêm máy in mới
export const addPrinter = async (printerData) => {
    try {
        const { printerId, roomId, ...data } = printerData;

        if (!printerId || !roomId) {
            throw new Error('printerId và roomId là bắt buộc');
        }

        const printerRef = firestore.collection('Printers').doc(printerId);
        const roomRef = firestore.collection('Rooms').doc(roomId);

        // Kiểm tra máy in đã tồn tại chưa
        const printerDoc = await printerRef.get();
        if (printerDoc.exists) {
            throw new Error('Máy in đã tồn tại!');
        }

        // Kiểm tra phòng có tồn tại trong danh sách phòng không
        const roomDoc = await roomRef.get();
        if (!roomDoc.exists) {
            throw new Error(`Phòng với ID "${roomId}" không tồn tại. Vui lòng thêm phòng trước khi thêm máy in.`);
        }

        // Thêm dữ liệu máy in
        const newPrinterData = {
            roomId,
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Lưu máy in vào Firestore
        await printerRef.set(newPrinterData);

        return { message: 'Thêm máy in thành công', printer: newPrinterData };
    } catch (error) {
        console.error('Lỗi khi thêm máy in:', error.message);
        throw new Error(`Không thể thêm máy in: ${error.message}`);
    }
};
// Xóa máy in
export const removePrinter = async (printerId) => {
    try {
        const ref = firestore.collection('Printers').doc(printerId);
        const doc = await ref.get();

        if (!doc.exists) {
            throw new Error('Máy in không tồn tại');
        }

        await ref.delete();
        return { message: 'Xóa máy in thành công' };
    } catch (error) {
        console.error('Lỗi khi xóa máy in:', error.message);
        throw new Error('Đã xảy ra lỗi khi xóa máy in');
    }
};

export const getPrinterList = async () => {
    try {
        const snapshot = await firestore.collection('Printers').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Lỗi khi lấy danh sách máy in:', error);
        return [];
    }
};
// Lấy danh sách phòng
export const getRoomList = async () => {
    try {
        const snapshot = await firestore.collection('Rooms').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Lỗi khi lấy danh sách phòng:', error.message);
        throw new Error(`Không thể lấy danh sách phòng: ${error.message}`);
    }
};
// Thêm phòng vào danh sách phòng
export const addRoom = async (roomData) => {
    try {
        const { roomId, name, description } = roomData;

        if (!roomId || !name) {
            throw new Error('roomId và name là bắt buộc');
        }

        const ref = firestore.collection('Rooms').doc(roomId);

        // Kiểm tra xem phòng đã tồn tại chưa
        const doc = await ref.get();
        if (doc.exists) {
            throw new Error('Phòng đã tồn tại!');
        }

        // Tạo dữ liệu phòng mới
        const newRoomData = {
            name,
            description: description || '',
            createdAt: new Date().toISOString()
        };

        // Thêm phòng vào Firestore
        await ref.set(newRoomData);

        return { message: 'Thêm phòng thành công', room: newRoomData };
    } catch (error) {
        console.error('Lỗi khi thêm phòng:', error.message);
        throw new Error(`Không thể thêm phòng: ${error.message}`);
    }
};

// Lấy cấu hình hệ thống
export const getSystemConfig = async () => {
    try {
        const snapshot = await firestore.collection(process.env.SYSTEM_CONFIGS_COLLECTION).get();
        return snapshot.docs.map((doc) => {
            const data = doc.data();
            if (data.nextLogDate && data.nextLogDate._seconds) {
                data.nextLogDate = new Date(data.nextLogDate._seconds * 1000).toISOString();
            }
            return { id: doc.id, ...data };
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách cấu hình:', error.message);
        throw new Error(`Không thể lấy danh sách cấu hình: ${error.message}`);
    }
};


// Lấy tất cả bản ghi lịch sử
export const getAllHistoryLogs = async () => {
    try {
        const snapshot = await firestore.collection(process.env.HISTORY_LOGS_COLLECTION).get();

        if (snapshot.empty) {
            console.warn('Danh sách HistoryLogs trống');
            return [];
        }

        const logs = snapshot.docs.map((doc) => {
            const historyLog = new HistoryLog();
            historyLog.setInfoFromJson({ ...doc.data(), hisLogId: doc.id });
            return historyLog.convertToJson();
        });

        return logs;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách HistoryLogs:', error.message);
        throw new Error(`Không thể lấy danh sách HistoryLogs: ${error.message}`);
    }
};


// Lấy một bản ghi lịch sử theo ID
export const getHistoryLogById = async (logId) => {
    try {
        if (!logId) {
            throw new Error('Thiếu thông tin logId');
        }
        const doc = await firestore.collection(process.env.HISTORY_LOGS_COLLECTION).doc(logId).get();
        if (!doc.exists) {
            throw new Error(`Không tìm thấy HistoryLog với ID: ${logId}`);
        }
        const historyLog = new HistoryLog();
        historyLog.setInfoFromJson({ ...doc.data(), hisLogId: logId });
        return historyLog.convertToJson();
    } catch (error) {
        console.error('Lỗi khi lấy HistoryLog:', error.message);
        throw new Error(`Không thể lấy HistoryLog: ${error.message}`);
    }
};

// Xóa một bản ghi lịch sử theo ID
export const removeHistoryLogById = async (logId) => {
    try {
        if (!logId) {
            throw new Error('Thiếu thông tin logId');
        }
        const doc = await firestore.collection(process.env.HISTORY_LOGS_COLLECTION).doc(logId).get();
        if (!doc.exists) {
            throw new Error(`Không tìm thấy HistoryLog với ID: ${logId}`);
        }
        await firestore.collection(process.env.HISTORY_LOGS_COLLECTION).doc(logId).delete();
        return { message: 'Xóa HistoryLog thành công', id: logId };
    } catch (error) {
        console.error('Lỗi khi xóa HistoryLog:', error.message);
        throw new Error(`Không thể xóa HistoryLog: ${error.message}`);
    }
};