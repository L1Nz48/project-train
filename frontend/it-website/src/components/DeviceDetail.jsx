import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Loading from './Loading';

function DeviceDetail() {
  const { id } = useParams();
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const API_URL = import.meta.env.VITE_API_URL || 'https://project-train.onrender.com';

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const res = await fetch(`${API_URL}/devices/${id}`, {
          signal: AbortSignal.timeout(30000),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || 'Device not found');
        }
        const data = await res.json();
        setDevice(data);

        if (isLoggedIn) {
          const token = localStorage.getItem('token');
          const favRes = await fetch(`${API_URL}/favorites`, {
            headers: { 'Authorization': `Bearer ${token}` },
            signal: AbortSignal.timeout(30000),
          });
          if (!favRes.ok) {
            throw new Error('Failed to fetch favorites');
          }
          const favData = await favRes.json();
          setIsFavorite(favData.some(fav => fav._id === id));
        }
      } catch (err) {
        console.error('Fetch error:', err.message);
        setError(err.message);
        toast.error(err.message === 'Device not found' ? 'ไม่พบอุปกรณ์' : 'เกิดข้อผิดพลาดในการเชื่อมต่อ', {
          position: 'top-right',
        });
        setTimeout(() => navigate('/devices'), 2000);
      } finally {
        setLoading(false);
      }
    };
    fetchDevice();
  }, [id, navigate, isLoggedIn]);

  const toggleFavorite = async () => {
    if (favoriteLoading) return;
    setFavoriteLoading(true);
    const token = localStorage.getItem('token');
    try {
      if (isFavorite) {
        const res = await fetch(`${API_URL}/favorites/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
          signal: AbortSignal.timeout(30000),
        });
        const data = await res.json();
        if (res.ok) {
          toast.success(data.message || 'ลบออกจากรายการโปรดสำเร็จ', { position: 'top-right' });
          setIsFavorite(false);
        } else {
          toast.error(data.message || 'เกิดข้อผิดพลาด', { position: 'top-right' });
        }
      } else {
        const res = await fetch(`${API_URL}/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ deviceId: id }),
          signal: AbortSignal.timeout(30000),
        });
        const data = await res.json();
        if (res.ok) {
          toast.success(data.message || 'เพิ่มในรายการโปรดสำเร็จ', { position: 'top-right' });
          setIsFavorite(true);
        } else {
          toast.error(data.message || 'เกิดข้อผิดพลาด', { position: 'top-right' });
        }
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อ', { position: 'top-right' });
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="container my-5 text-center">
        <h2 className="text-danger fs-4">เกิดข้อผิดพลาด: {error}</h2>
        <p className="fs-5">กำลังนำคุณกลับไปหน้ารายการอุปกรณ์...</p>
      </div>
    );
  }

  if (!device) {
    return null;
  }

  return (
    <div className="container my-5">
      <div className="card shadow-lg p-4 mx-auto device-detail-card">
        <img
          src={device.imageUrl}
          className="card-img-top device-detail-img"
          alt={`รูปภาพของ ${device.name}`}
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found'; }}
        />
        <div className="card-body">
          <h2 className="card-title text-primary fw-bold fs-4">{device.name}</h2>
          <p className="card-text text-muted fs-5">{device.description}</p>
          <ul className="list-group list-group-flush mb-3">
            <li className="list-group-item"><strong>หมวดหมู่:</strong> {device.category}</li>
            <li className="list-group-item"><strong>ยี่ห้อ:</strong> {device.brand}</li>
            <li className="list-group-item"><strong>รุ่น:</strong> {device.model}</li>
            <li className="list-group-item"><strong>ราคา:</strong> {device.price.toLocaleString()} บาท</li>
          </ul>
          <div className="d-flex justify-content-between align-items-center">
            <button
              className="btn btn-outline-primary"
              onClick={() => navigate('/devices')}
              aria-label="กลับไปหน้ารายการอุปกรณ์"
            >
              กลับ
            </button>
            {isLoggedIn && (
              <button
                className={`btn btn-favorite ${isFavorite ? 'favorite-active' : 'btn-outline-secondary'}`}
                onClick={toggleFavorite}
                disabled={favoriteLoading}
                aria-label={isFavorite ? 'ลบออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
              >
                {favoriteLoading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  isFavorite ? '★' : '☆'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default DeviceDetail;