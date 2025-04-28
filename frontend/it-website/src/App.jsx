import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Navbar from './components/Navbar';
import DeviceList from './components/DeviceList';
import AdminForm from './components/AdminForm';
import Login from './components/Login';
import Home from './components/Home';
import Profile from './components/Profile';
import DeviceDetail from './components/DeviceDetail';
import Favorites from './components/Favorites';
import Footer from './components/Footer';
import Loading from './components/Loading';

function App() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'https://project-train.onrender.com';

  useEffect(() => {
    console.log('Starting to fetch devices from:', API_URL);
    const fetchDevices = async () => {
      try {
        const response = await fetch(`${API_URL}/devices`, {
          signal: AbortSignal.timeout(30000), // Timeout 30 วินาที
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch devices: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Devices fetched:', data);
        setDevices(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ backend');
        setLoading(false);
      }
    };
    fetchDevices();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="container my-5 text-center">
        <h2 className="text-danger fs-4">เกิดข้อผิดพลาด: {error}</h2>
        <p className="fs-5">กรุณาตรวจสอบการเชื่อมต่อ backend หรือรีเฟรชหน้า</p>
        <button 
          className="btn btn-primary mt-3" 
          onClick={() => window.location.reload()}
        >
          ลองใหม่
        </button>
      </div>
    );
  }

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/devices" element={<DeviceList devices={devices} />} />
            <Route path="/devices/:id" element={<DeviceDetail />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                localStorage.getItem('role') === 'admin' ? <AdminForm /> : <Login />
              }
            />
            <Route
              path="/profile"
              element={
                localStorage.getItem('token') ? <Profile /> : <Login />
              }
            />
            <Route
              path="/favorites"
              element={
                localStorage.getItem('token') ? <Favorites /> : <Login />
              }
            />
            <Route
              path="*"
              element={
                <div className="container my-5 text-center">
                  <h2 className="text-danger fs-4">404 Not Found</h2>
                  <p className="fs-5">ขออภัย ไม่พบหน้าที่คุณต้องการ</p>
                  <Link to="/" className="btn btn-primary">กลับสู่หน้าแรก</Link>
                </div>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;