import React, { useState, useEffect } from "react";
import { Box } from "@mui/system";
import "../../../Styles/Wallet.css";

const Wallet = () => {
  const [wallet, setWallet] = useState(null); // Lưu trữ dữ liệu wallet
  const [depositAmount, setDepositAmount] = useState("");

  const fetchWallet = async (token) => {
    try {
      const response = await fetch('http://...', { // Sửa URL API
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      const result = await response.json();
      if (response.ok) {
        // Gán dữ liệu vào state wallet
        setWallet({
          walletId: result.walletId,
          ownerId: result.ownerId,
          availablePages: result.availablePages,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
          lastSemesterUpdate: result.lastSemesterUpdate,
        });
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
    }
  };

  // Fetch wallet information khi component mount
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      fetchWallet(accessToken);
    }
  }, []); // Chỉ gọi 1 lần khi component mount

  const handleDeposit = () => {
    if (depositAmount) {
      setWallet((prev) => ({
        ...prev,
        availablePages: prev.availablePages + parseInt(depositAmount, 10),
        updatedAt: new Date().toISOString().split("T")[0],
      }));
      setDepositAmount("");
    }
  };

  // Kiểm tra nếu wallet chưa được tải
  if (!wallet) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ paddingTop: "100px" }}>
    <div className="wallet-container">
      <h1 className="wallet-title">Student Wallet</h1>

      {/* Bảng thông tin Wallet */}
      <table className="wallet-info-table">
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Wallet ID</strong></td>
            <td>{wallet.walletId}</td>
          </tr>
          <tr>
            <td><strong>Owner ID</strong></td>
            <td>{wallet.ownerId}</td>
          </tr>
          <tr>
            <td><strong>Available Pages</strong></td>
            <td>{wallet.availablePages}</td>
          </tr>
          <tr>
            <td><strong>Created At</strong></td>
            <td>{wallet.createdAt}</td>
          </tr>
          <tr>
            <td><strong>Last Updated</strong></td>
            <td>{wallet.updatedAt}</td>
          </tr>
          <tr>
            <td><strong>Last Semester Update</strong></td>
            <td>{wallet.lastSemesterUpdate}</td>
          </tr>
        </tbody>
      </table>

      {/* Hành động Deposit */}
      <div className="wallet-actions">
        <h2>Deposit Pages</h2>
        <input
          type="number"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          placeholder="Enter pages to deposit"
        />
        <button onClick={handleDeposit}>Deposit</button>
      </div>
    </div>
    </Box>
  );
};

export default Wallet;