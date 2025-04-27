import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


function Login() {
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
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
    if (loading) return;
    if (loginData.password.length < 6) {
      toast.error('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร', { position: 'top-right' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
        signal: AbortSignal.timeout(30000),
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
      toast.error(err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ', { position: 'top-right' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (registerData.password.length < 6) {
      toast.error('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร', { position: 'top-right' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...registerData, role: 'user' }),
        signal: AbortSignal.timeout(30000),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'ลงทะเบียนสำเร็จ!', { position: 'top-right' });
        setActiveTab('login');
        setRegisterData({ username: '', password: '' });
      } else {
        throw new Error(data.message || 'เกิดข้อผิดพลาดในการลงทะเบียน');
      }
    } catch (err) {
      toast.error(err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ', { position: 'top-right' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="card shadow-lg p-4 mx-auto login-card">
        <h2 className="text-center mb-4 text-primary fw-bold">เข้าสู่ระบบ / ลงทะเบียน</h2>
        <nav className="nav nav-tabs mb-4">
          <button
            className={`nav-link ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
            aria-selected={activeTab === 'login'}
            disabled={loading}
          >
            ล็อกอิน
          </button>
          <button
            className={`nav-link ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
            aria-selected={activeTab === 'register'}
            disabled={loading}
          >
            ลงทะเบียน
          </button>
        </nav>

        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} aria-label="ฟอร์มล็อกอิน">
            <div className="mb-3">
              <label htmlFor="login-username" className="form-label fw-bold">ชื่อผู้ใช้</label>
              <input
                type="text"
                id="login-username"
                name="username"
                value={loginData.username}
                onChange={handleLoginChange}
                className="form-control"
                required
                disabled={loading}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="login-password" className="form-label fw-bold">รหัสผ่าน</label>
              <input
                type="password"
                id="login-password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                className="form-control"
                required
                disabled={loading}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                'ล็อกอิน'
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} aria-label="ฟอร์มลงทะเบียน">
            <div className="mb-3">
              <label htmlFor="register-username" className="form-label fw-bold">ชื่อผู้ใช้</label>
              <input
                type="text"
                id="register-username"
                name="username"
                value={registerData.username}
                onChange={handleRegisterChange}
                className="form-control"
                required
                disabled={loading}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="register-password" className="form-label fw-bold">รหัสผ่าน</label>
              <input
                type="password"
                id="register-password"
                name="password"
                value={registerData.password}
                onChange={handleRegisterChange}
                className="form-control"
                required
                disabled={loading}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                'ลงทะเบียน'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;