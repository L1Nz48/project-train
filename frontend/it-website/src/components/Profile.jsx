import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // ยังคง import แต่ไม่ใช้ toast
import Loading from './Loading';

function Profile() {
  const [profileData, setProfileData] = useState({ 
    username: '', 
    oldPassword: '', 
    newPassword: '', 
    createdAt: '' 
    
  });


  const API_URL = import.meta.env.VITE_API_URL || 'https://project-train.onrender.com';



  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(''); // เพิ่ม state สำหรับ error
  const [successMessage, setSuccessMessage] = useState(''); // เพิ่ม state สำหรับ success
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setErrorMessage('กรุณาล็อกอินก่อน');
          navigate('/login');
          return;
        }

        const res = await fetch('${API_URL}/profile', {
          headers: { 'Authorization': `Bearer ${token}` },
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
          setErrorMessage(data.message || 'ไม่สามารถดึงข้อมูลโปรไฟล์');
          navigate('/login');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setErrorMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ');
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
    setErrorMessage(''); // ล้าง error เมื่อพิมพ์
    setSuccessMessage(''); // ล้าง success เมื่อพิมพ์
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('${API_URL}/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: profileData.oldPassword,
          newPassword: profileData.newPassword,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccessMessage('อัปเดตรหัสผ่านสำเร็จ!');
        setProfileData({ ...profileData, oldPassword: '', newPassword: '' }); // ล้างฟอร์ม
      } else {
        setErrorMessage(data.message || 'เกิดข้อผิดพลาด');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setErrorMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: '500px', borderRadius: '15px' }}>
        <div className="text-center mb-4">
          <div
            className="bg-primary text-white p-3 rounded-circle mx-auto"
            style={{ width: '80px', height: '80px', lineHeight: '50px', fontSize: '2rem' }}
          >
            {profileData.username.charAt(0).toUpperCase()}
          </div>
          <h2 className="mt-3 text-primary fw-bold">{profileData.username}</h2>
          <p className="text-muted">สมาชิกตั้งแต่: {profileData.createdAt}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label fw-bold text-dark">ชื่อผู้ใช้</label>
            <input
              type="text"
              name="username"
              value={profileData.username}
              className="form-control shadow-sm"
              readOnly
              style={{ borderRadius: '10px', backgroundColor: '#f0f0f0' }}
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-bold text-dark">รหัสผ่านเก่า</label>
            <input
              type="password"
              name="oldPassword"
              value={profileData.oldPassword}
              onChange={handleChange}
              className="form-control shadow-sm"
              placeholder="กรุณากรอกรหัสผ่านเก่า"
              style={{ borderRadius: '10px' }}
            />
            {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
          </div>
          <div className="mb-4">
            <label className="form-label fw-bold text-dark">รหัสผ่านใหม่</label>
            <input
              type="password"
              name="newPassword"
              value={profileData.newPassword}
              onChange={handleChange}
              className="form-control shadow-sm"
              placeholder="กรุณากรอกรหัสผ่านใหม่"
              style={{ borderRadius: '10px' }}
            />
          </div>
          {successMessage && <p className="text-success mb-4 text-center">{successMessage}</p>}
          <button type="submit" className="btn btn-primary w-100">
            อัปเดตรหัสผ่าน
          </button>
          <button
            className="btn btn-outline-secondary w-100 mt-3"
            onClick={() => navigate('/')}
          >
            กลับไปหน้าแรก
          </button>
        </form>
      </div>
      <ToastContainer /> {/* ยังคงไว้เผื่อใช้ในอนาคต */}
    </div>
  );
}

export default Profile;