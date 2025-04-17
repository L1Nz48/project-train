import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Loading from './Loading';

function DeviceDetail() {
  const { id } = useParams();
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false); // เพิ่ม state สำหรับสถานะโปรด
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const res = await fetch(`${API_URL}/devices/${id}`);
        if (!res.ok) {
          throw new Error('Device not found');
        }
        const data = await res.json();
        setDevice(data);

        if (isLoggedIn) {
          const token = localStorage.getItem('token');
          const favRes = await fetch('${API_URL}/favorites', {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          const favData = await favRes.json();
          if (favRes.ok) {
            setIsFavorite(favData.some(fav => fav._id === id));
          }
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
    const token = localStorage.getItem('token');
    try {
      if (isFavorite) {
        const res = await fetch(`${API_URL}/favorites/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          toast.success(data.message, { position: 'top-right' });
          setIsFavorite(false);
        } else {
          toast.error(data.message, { position: 'top-right' });
        }
      } else {
        const res = await fetch('${API_URL}/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ deviceId: id }),
        });
        const data = await res.json();
        if (res.ok) {
          toast.success(data.message, { position: 'top-right' });
          setIsFavorite(true);
        } else {
          toast.error(data.message, { position: 'top-right' });
        }
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อ', { position: 'top-right' });
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="container mt-5 text-center">
        <h2 className="text-danger">เกิดข้อผิดพลาด: {error}</h2>
        <p>กำลังนำคุณกลับไปหน้ารายการอุปกรณ์...</p>
      </div>
    );
  }

  if (!device) {
    return null;
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: '700px', borderRadius: '15px' }}>
        <img
          src={device.imageUrl}
          className="card-img-top"
          alt={device.name}
          style={{ height: '300px', objectFit: 'cover', borderRadius: '15px 15px 0 0' }}
        />
        <div className="card-body">
          <h2 className="card-title text-primary fw-bold">{device.name}</h2>
          <p className="card-text text-muted">{device.description}</p>
          <ul className="list-group list-group-flush mb-3">
            <li className="list-group-item"><strong>หมวดหมู่:</strong> {device.category}</li>
            <li className="list-group-item"><strong>ยี่ห้อ:</strong> {device.brand}</li>
            <li className="list-group-item"><strong>รุ่น:</strong> {device.model}</li>
            <li className="list-group-item"><strong>ราคา:</strong> {device.price.toLocaleString()} บาท</li>
          </ul>
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-outline-primary"
              onClick={() => navigate('/devices')}
            >
              กลับไปหน้ารายการอุปกรณ์
            </button>
            {isLoggedIn && (
              <button
                className={`btn btn-star ${isFavorite ? 'btn-danger' : 'btn-outline-secondary'}`}
                onClick={toggleFavorite}
              >
                {isFavorite ? '★' : '☆'}
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