import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from './Loading';


function Profile() {
  const [profileData, setProfileData] = useState({
    username: '',
    oldPassword: '',
    newPassword: '',
    createdAt: '',
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'https://project-train.onrender.com';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('กรุณาล็อกอินก่อน', { position: 'top-right' });
          navigate('/login');
          return;
        }

        const res = await fetch(`${API_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: AbortSignal.timeout(30000),
        });
        const data = await res.json();

        if (res.ok) {
          setProfileData({
            username: data.username || 'ไม่ระบุ',
            oldPassword: '',
            newPassword: '',
            createdAt: data.createdAt
              ? new Date(data.createdAt).toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : 'ไม่ระบุ',
          });
        } else {
          toast.error(data.message || 'ไม่สามารถดึงข้อมูลโปรไฟล์', { position: 'top-right' });
          navigate('/login');
        }
      } catch (err) {
        toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อ', { position: 'top-right' });
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (profileData.newPassword.length < 6) {
      toast.error('รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร', { position: 'top-right' });
      return;
    }
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: profileData.oldPassword,
          newPassword: profileData.newPassword,
        }),
        signal: AbortSignal.timeout(30000),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success('อัปเดตรหัสผ่านสำเร็จ!', { position: 'top-right' });
        setProfileData({ ...profileData, oldPassword: '', newPassword: '' });
      } else {
        toast.error(data.message || 'เกิดข้อผิดพลาด', { position: 'top-right' });
      }
    } catch (err) {
      toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อ', { position: 'top-right' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container my-5">
      <div className="card shadow-lg p-4 mx-auto profile-card">
        <div className="text-center mb-4">
          <div
            className="bg-primary text-white p-3 rounded-circle mx-auto profile-avatar"
            aria-hidden="true"
          >
            {profileData.username.charAt(0).toUpperCase()}
          </div>
          <h2 className="mt-3 text-primary fw-bold">{profileData.username}</h2>
          <p className="text-muted">สมาชิกตั้งแต่: {profileData.createdAt}</p>
        </div>

        <form onSubmit={handleSubmit} aria-label="ฟอร์มอัปเดตรหัสผ่าน">
          <div className="mb-4">
            <label htmlFor="username" className="form-label fw-bold text-dark">
              ชื่อผู้ใช้
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={profileData.username}
              className="form-control shadow-sm"
              readOnly
            />
          </div>
          <div className="mb-4">
            <label htmlFor="old-password" className="form-label fw-bold text-dark">
              รหัสผ่านเก่า
            </label>
            <input
              id="old-password"
              type="password"
              name="oldPassword"
              value={profileData.oldPassword}
              onChange={handleChange}
              className="form-control shadow-sm"
              placeholder="กรุณากรอกรหัสผ่านเก่า"
              disabled={loading}
            />
            {errorMessage && (
              <p className="text-danger mt-2" role="alert">
                {errorMessage}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="new-password" className="form-label fw-bold text-dark">
              รหัสผ่านใหม่
            </label>
            <input
              id="new-password"
              type="password"
              name="newPassword"
              value={profileData.newPassword}
              onChange={handleChange}
              className="form-control shadow-sm"
              placeholder="กรุณากรอกรหัสผ่านใหม่"
              disabled={loading}
            />
          </div>
          {successMessage && (
            <p className="text-success mb-4 text-center" role="alert">
              {successMessage}
            </p>
          )}
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              'อัปเดตรหัสผ่าน'
            )}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary w-100 mt-3"
            onClick={() => navigate('/')}
            disabled={loading}
          >
            กลับไปหน้าแรก
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;