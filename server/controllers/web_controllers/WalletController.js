import Wallet from "../../models/Wallet.js";
import { firestore } from "../../services/FirebaseAdminSDK.js"; // Firestore instance

const walletsCollection = firestore.collection("wallets");

// Tạo ví mới
export const createWallet = async (walletId, ownerId, createAt) => {
  try {
    const wallet = new Wallet(walletId, ownerId, 100, createAt, createAt, null);
    await walletsCollection.doc(walletId).set(wallet.convertToJson());
    return wallet.convertToJson();
  } catch (error) {
    throw new Error(`Không thể tạo ví: ${error.message}`);
  }
};

// Thêm số trang in vào ví
export const addPagesToWallet = async (walletId, pages) => {
  try {
    if (pages < 0) throw new Error("Không thể thêm số trang âm.");

    const doc = await walletsCollection.doc(walletId).get();
    if (!doc.exists) throw new Error("Ví không tồn tại.");

    const wallet = new Wallet();
    wallet.setInfoFromJson(doc.data());
    wallet.availablePages += pages;
    wallet.updateAt = new Date().toISOString();

    await walletsCollection.doc(walletId).update(wallet.convertToJson());
    return wallet.convertToJson();
  } catch (error) {
    throw new Error(`Cập nhật ví thất bại: ${error.message}`);
  }
};

// Lấy thông tin ví
export const getWallet = async (walletId) => {
  try {
    const doc = await walletsCollection.doc(walletId).get();
    if (!doc.exists) throw new Error("Ví không tồn tại.");

    return doc.data();
  } catch (error) {
    throw new Error(`Không thể lấy thông tin ví: ${error.message}`);
  }
};

// Kiểm tra số dư trang in
export const checkBalance = async (walletId, requiredPages) => {
  try {
    const doc = await walletsCollection.doc(walletId).get();
    if (!doc.exists) throw new Error("Ví không tồn tại.");

    const wallet = new Wallet();
    wallet.setInfoFromJson(doc.data());

    return wallet.availablePages >= requiredPages;
  } catch (error) {
    throw new Error(`Không thể kiểm tra số dư: ${error.message}`);
  }
};

// Trừ số trang in từ ví
export const deductPages = async (walletId, pages) => {
  try {
    if (pages <= 0) throw new Error("Số trang cần trừ phải lớn hơn 0.");

    const doc = await walletsCollection.doc(walletId).get();
    if (!doc.exists) throw new Error("Ví không tồn tại.");

    const wallet = new Wallet();
    wallet.setInfoFromJson(doc.data());

    if (wallet.availablePages < pages) throw new Error("Không đủ số dư trang in.");

    wallet.availablePages -= pages;
    wallet.updateAt = new Date().toISOString();

    await walletsCollection.doc(walletId).update(wallet.convertToJson());
    return wallet.convertToJson();
  } catch (error) {
    throw new Error(`Không thể trừ số trang: ${error.message}`);
  }
};
