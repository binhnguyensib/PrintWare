import React from 'react';
import ReactDOM from 'react-dom/client'; // Sử dụng `react-dom/client` thay vì `react-dom`
import App from './App';
import './Styles/Styles.css';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const root = ReactDOM.createRoot(document.getElementById('root')); // Tạo root
root.render(

  
    <><App />
        <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light" />
    </>


);
