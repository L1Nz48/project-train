import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Navbar() {
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');
  const navigate = useNavigate();
  const [theme, setTheme] = useState('light');
  const [userStats, setUserStats] = useState({ total: 0, admins: 0, users: 0 });
  const [isScrolled, setIsScrolled] = useState(false); // เพิ่ม state เพื่อตรวจจับการเลื่อน

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    toast.success('ออกจากระบบสำเร็จ!', { position: 'top-right' });
    setTimeout(() => navigate('/'), 1500);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.className = newTheme;
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.body.className = savedTheme;

    if (role === 'admin') {
      fetchUserStats();
    }

    // ตรวจจับการเลื่อน
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // ล้าง event listener
  }, [role]);

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('${API_URL}/users/stats', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUserStats(data);
      } else {
        console.error('Error fetching user stats:', data.message);
      }
    } catch (err) {
      console.error('Error fetching user stats:', err);
    }
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark bg-dark shadow-sm ${isScrolled ? 'small' : ''}`}>
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">IT L1Nz</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">หน้าแรก</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/devices">อุปกรณ์</Link>
            </li>
            {role && (
              <li className="nav-item">
                <Link className="nav-link" to="/favorites">รายการโปรด</Link>
              </li>
            )}
            {!role && (
              <li className="nav-item">
                <Link className="nav-link" to="/login">ล็อกอิน</Link>
              </li>
            )}
            {role === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">จัดการข้อมูล</Link>
              </li>
            )}
            {role && (
              <li className="nav-item">
                <Link className="nav-link" to="/profile">โปรไฟล์</Link>
              </li>
            )}
          </ul>
          <ul className="navbar-nav">
            {role && (
              <>
                <li className="nav-item">
                  <span className="nav-link text-info">สวัสดี, {username}</span>
                </li>
                {role === 'admin' && (
                  <li className="nav-item">
                    <span className="nav-link text-light">
                      ผู้ใช้ทั้งหมด: {userStats.total} (Admin: {userStats.admins}, User: {userStats.users})
                    </span>
                  </li>
                )}
                <li className="nav-item">
                  <button className="btn btn-link text-warning no-underline" onClick={handleLogout}>
                    ออกจากระบบ
                  </button>
                </li>
              </>
            )}
            <li className="nav-item">
              <button className="btn btn-link text-light no-underline" onClick={toggleTheme}>
                {theme === 'light' ? '🌙 มืด' : '☀️ สว่าง'}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;