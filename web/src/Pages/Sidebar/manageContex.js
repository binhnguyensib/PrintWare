import React, { createContext, useState, useContext } from 'react';

// Tạo Context
const ManageContext = createContext();

// Provider để bọc ứng dụng và chia sẻ trạng thái
export const ManageProvider = ({ children }) => {
  const [showManageCon, setShowManageCon] = useState(false); // Trạng thái ban đầu

  return (
    <ManageContext.Provider value={{ showManageCon, setShowManageCon }}>
      {children}
    </ManageContext.Provider>
  );
};

// Hook để dễ sử dụng trong component
export const useManage = () => useContext(ManageContext);
