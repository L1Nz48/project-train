import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './index.css'; // เพิ่มไฟล์ CSS หลัก
import './Loading.css'; 
import './Navbar.css';
import './DeviceDetail.css'
import './DeviceList.css';
import './Favorites.css';
import './Footer.css';
import './Home.css';
import './Login.css';
import './Profile.css';
import './global.css';
import './ThemeContext';
import 'bootstrap-icons/font/bootstrap-icons.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);