import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'https://project-train.onrender.com';

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log('Logging in with API_URL:', API_URL);
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('username', data.username);
        toast.success('ล็อกอินสำเร็จ!', { position: 'top-right' });
        setTimeout(() => navigate('/'), 2000);
      } else {
        throw new Error(data.message || 'เกิดข้อผิดพลาดในการล็อกอิน');
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error(err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ', { position: 'top-right' });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      console.log('Registering with API_URL:', API_URL);
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...registerData, role: 'user' }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message, { position: 'top-right' });
        setActiveTab('login');
        setRegisterData({ username: '', password: '' });
      } else {
        throw new Error(data.message || 'เกิดข้อผิดพลาดในการลงทะเบียน');
      }
    } catch (err) {
      console.error('Register error:', err);
      toast.error(err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ', { position: 'top-right' });
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4 text-primary fw-bold">เข้าสู่ระบบ / ลงทะเบียน</h2>
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'login' ? 'active' : ''} btn btn-outline-primary`}
              onClick={() => setActiveTab('login')}
            >
              ล็อกอิน
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'register' ? 'active' : ''} btn btn-outline-primary`}
              onClick={() => setActiveTab('register')}
            >
              ลงทะเบียน
            </button>
          </li>
        </ul>

        {activeTab === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label fw-bold">ชื่อผู้ใช้</label>
              <input
                type="text"
                name="username"
                value={loginData.username}
                onChange={handleLoginChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">รหัสผ่าน</label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                className="form-control"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">ล็อกอิน</button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="form-label fw-bold">ชื่อผู้ใช้</label>
              <input
                type="text"
                name="username"
                value={registerData.username}
                onChange={handleRegisterChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">รหัสผ่าน</label>
              <input
                type="password"
                name="password"
                value={registerData.password}
                onChange={handleRegisterChange}
                className="form-control"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">ลงทะเบียน</button>
          </form>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;