import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Loading from './Loading';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('กรุณาล็อกอินก่อน', { position: 'top-right' });
          navigate('/login');
          return;
        }

        const res = await fetch('${API_URL}/favorites', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setFavorites(data);
        } else {
          toast.error(data.message || 'ไม่สามารถดึงรายการโปรด', { position: 'top-right' });
        }
      } catch (err) {
        console.error('Error fetching favorites:', err);
        toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อ', { position: 'top-right' });
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [navigate]);

  const removeFromFavorites = async (deviceId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/${deviceId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message, { position: 'top-right' });
        setFavorites(favorites.filter(device => device._id !== deviceId));
      } else {
        toast.error(data.message, { position: 'top-right' });
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อ', { position: 'top-right' });
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 fw-bold text-primary">รายการโปรดของฉัน</h2>
      {favorites.length === 0 ? (
        <p className="text-center text-muted">คุณยังไม่มีอุปกรณ์ในรายการโปรด</p>
      ) : (
        <div className="row">
          {favorites.map(device => (
            <div className="col-md-4 mb-4" key={device._id}>
              <div 
                className="card h-100 border-0 shadow-sm card-clickable"
                onClick={() => navigate(`/devices/${device._id}`)}
              >
                <img src={device.imageUrl} className="card-img-top" alt={device.name} style={{ height: '200px', objectFit: 'cover' }} />
                <div className="card-body">
                  <h5 className="card-title text-primary">{device.name}</h5>
                  <p className="card-text text-muted">{device.description.substring(0, 100)}...</p>
                  <p className="card-text fw-bold text-success">ราคา: {device.price.toLocaleString()} บาท</p>
                  <button
                    className="btn btn-star btn-outline-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromFavorites(device._id);
                    }}
                  >
                    ★
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default Favorites;