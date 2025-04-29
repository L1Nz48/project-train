import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { ThemeContext } from '../ThemeContext';

function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState({ total: 0, admins: 0, users: 0 });
  const [isScrolled, setIsScrolled] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'https://project-train.onrender.com';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    toast.success('ออกจากระบบสำเร็จ!', { position: 'top-right' });
    setTimeout(() => navigate('/'), 1500);
  };

  useEffect(() => {
    if (role === 'admin') {
      fetchUserStats();
    }

    const handleScroll = () => {
      console.log('Scroll position:', window.scrollY); // Debug log
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [role]);

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/users/stats`, {
        headers: { 'Authorization': `Bearer ${token}` },
        signal: AbortSignal.timeout(30000),
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
    <nav className={`navbar navbar-expand-lg ${isScrolled ? 'small' : ''}`}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img 
            src="/frontend/it-website/src/components/photo/L1Nz.webp" 
            alt="IT L1Nz Logo" 
            className="navbar-logo"
          />
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
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
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {role && (
              <>
                <li className="nav-item d-flex align-items-center">
                  <span className="nav-link text-info text-truncate" style={{ maxWidth: '150px' }}>
                    สวัสดี, {username}
                  </span>
                </li>
                {role === 'admin' && (
                  <li className="nav-item d-flex align-items-center d-none d-lg-flex">
                    <span className="nav-link text-light text-truncate" style={{ maxWidth: '200px' }}>
                      ผู้ใช้: {userStats.total} (Admin: {userStats.admins}, User: {userStats.users})
                    </span>
                  </li>
                )}
                <li className="nav-item">
                  <button 
                    className="btn btn-link text-warning no-underline ms-2" 
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right"></i> ออก
                  </button>
                </li>
              </>
            )}
            <li className="nav-item">
              <button 
                className="btn btn-link text-light no-underline ms-2" 
                onClick={toggleTheme}
                aria-label={theme === 'light' ? 'เปลี่ยนเป็นโหมดมืด' : 'เปลี่ยนเป็นโหมดสว่าง'}
              >
                {theme === 'light' ? <i className="bi bi-moon-stars-fill"></i> : <i className="bi bi-sun-fill"></i>}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;