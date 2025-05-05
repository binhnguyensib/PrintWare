import { Router } from 'express';
import {
    index,
    updatePageUnitPrice,
    updatePageSizes,
    updateDefaultPrintConfig,
    updateNextLogDate,
    getPrinter,
    addPrinter,
    removePrinter,
    getPrinterList,
    getRoomList,
    getSystemConfig,
    addRoom,
    getAllHistoryLogs,
    getHistoryLogById,
    removeHistoryLogById
} from '../../controllers/web_controllers/SPSO.js';
const router = Router();

// Trang chào
router.get('/', async (req, res) => {
    try {
        const response = await index();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Cập nhật giá trị pageUnitPrice
router.post('/updatePageUnitPrice', async (req, res) => {
    try {
        const response = await updatePageUnitPrice(req.body);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Cập nhật kích thước trang :done
router.post('/updatePageSizes', async (req, res) => {
    try {
        const response = await updatePageSizes(req.body);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Cập nhật cấu hình in mặc định: done 
router.post('/updateDefaultPrintConfig', async (req, res) => {
    try {
        const response = await updateDefaultPrintConfig(req.body);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Cập nhật ngày log tiếp theo : done
router.post('/updateNextLogDate', async (req, res) => {
    try {
        const response = await updateNextLogDate(req.body);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Lấy thông tin máy in: done
router.get('/printer/:printerId', async (req, res) => {
    try {
        const { printerId } = req.params;

        if (!printerId) {
            return res.status(400).json({ success: false, error: 'Thiếu printerId' });
        }

        const printer = await getPrinter(printerId);
        if (!printer) {
            return res.status(404).json({ success: false, error: `Không tìm thấy máy in với id: ${printerId}` });
        }

        res.status(200).json({ success: true, data: printer });
    } catch (error) {
        console.error(`Lỗi trong route /printer/:printerId: ${error.message}`);
        res.status(500).json({ success: false, error: 'Lỗi hệ thống' });
    }
});

// Lấy danh sách máy in : done
router.get('/printerList', async (req, res) => {
    try {
        const response = await getPrinterList();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Thêm máy in mới: done 
router.post('/addPrinter', async (req, res) => {
    try {
        const printerData = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!printerData.printerId || !printerData.roomId || !printerData.detail || !printerData.config) {
            return res.status(400).json({
                success: false,
                error: 'Dữ liệu không hợp lệ. Vui lòng cung cấp đầy đủ thông tin!'
            });
        }
        // Gọi controller và xử lý phản hồi
        const response = await addPrinter(printerData);
        res.status(201).json({
            success: true,
            message: 'Thêm máy in thành công!',
            data: response
        });
    } catch (error) {
        console.error('Lỗi trong route /addPrinter:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Xóa máy in : done
router.delete('/removePrinter/:printerId', async (req, res) => {
    try {
        const { printerId } = req.params;  // Đảm bảo rằng printerId có trong URL
        
        // Kiểm tra dữ liệu đầu vào
        if (!printerId) {
            return res.status(400).json({
                success: false,
                error: 'Thiếu printerId'
            });
        }

        const response = await removePrinter(printerId);  // Gọi controller để xóa máy in
        res.status(200).json({ success: true, message: 'Xóa máy in thành công', data: response });
    } catch (error) {
        console.error('Lỗi trong route /removePrinter:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});
// Tạo phòng mới 
router.post('/addRoom', async (req, res) => {
    try {
        const roomData = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!roomData.roomId || !roomData.name) {
            return res.status(400).json({
                success: false,
                error: 'Dữ liệu không hợp lệ. Vui lòng cung cấp đầy đủ thông tin roomId và name!'
            });
        }

        // Gọi controller và xử lý phản hồi
        const response = await addRoom(roomData);
        res.status(201).json({
            success: true,
            message: 'Thêm phòng thành công!',
            data: response,
        });
    } catch (error) {
        console.error('Lỗi trong route /addRoom:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});
// Lấy danh sách phòng: done
router.get('/roomList', async (req, res) => {
    try {
        const response = await getRoomList();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Lấy cấu hình hệ thống: done
router.get('/config', async (req, res) => {
    try {
        const response = await getSystemConfig();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Lấy tất cả bản ghi lịch sử: Done
router.get('/getAllHisLog', async (req, res) => {
    try {
        const result = await getAllHistoryLogs();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Lấy một bản ghi lịch sử theo ID : Done
router.get('/getHisLog/:id', async (req, res) => {
    try {
        const result = await getHistoryLogById(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Xóa một bản ghi lịch sử theo ID : done
router.delete('/deleteHisLog/:id', async (req, res) => {
    try {
        const result = await removeHistoryLogById(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});


export default router;