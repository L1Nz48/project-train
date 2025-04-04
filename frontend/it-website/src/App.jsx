import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar';
import DeviceList from './components/DeviceList';
import AdminForm from './components/AdminForm';
import Login from './components/Login';
import Home from './components/Home';
import Profile from './components/Profile';
import DeviceDetail from './components/DeviceDetail';
import Favorites from './components/Favorites'; // เพิ่มหน้าใหม่
import Footer from './components/Footer';
import Loading from './components/Loading';

function App() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Starting to fetch devices...');
    fetch('http://localhost:5000/devices')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch devices');
        }
        return res.json();
      })
      .then(data => {
        console.log('Devices fetched:', data);
        setDevices(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err.message);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="container mt-5 text-center">
        <h2 className="text-danger">เกิดข้อผิดพลาด: {error}</h2>
        <p>กรุณาตรวจสอบการเชื่อมต่อ backend หรือรีเฟรชหน้า</p>
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
          </Routes>
        </main>
        <Footer />
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;