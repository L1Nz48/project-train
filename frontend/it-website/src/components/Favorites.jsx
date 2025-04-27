import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from './Loading';
import './Favorites.css';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removeLoading, setRemoveLoading] = useState({});
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'https://project-train.onrender.com';

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('กรุณาล็อกอินก่อน', { position: 'top-right' });
          navigate('/login');
          return;
        }

        const res = await fetch(`${API_URL}/favorites`, {
          headers: { 'Authorization': `Bearer ${token}` },
          signal: AbortSignal.timeout(30000),
        });
        const data = await res.json();
        if (res.ok) {
          setFavorites(data);
        } else {
          throw new Error(data.message || 'ไม่สามารถดึงรายการโปรด');
        }
      } catch (err) {
        console.error('Error fetching favorites:', err);
        toast.error(err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ', { position: 'top-right' });
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [navigate]);

  const removeFromFavorites = async (deviceId) => {
    if (removeLoading[deviceId]) return;
    setRemoveLoading(prev => ({ ...prev, [deviceId]: true }));
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/favorites/${deviceId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
        signal: AbortSignal.timeout(30000),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'ลบออกจากรายการโปรดสำเร็จ', { position: 'top-right' });
        setFavorites(favorites.filter(device => device._id !== deviceId));
      } else {
        throw new Error(data.message || 'ไม่สามารถลบรายการโปรด');
      }
    } catch (err) {
      console.error('Remove favorite error:', err);
      toast.error(err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ', { position: 'top-right' });
    } finally {
      setRemoveLoading(prev => ({ ...prev, [deviceId]: false }));
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 fw-bold text-primary fs-4">รายการโปรดของฉัน</h2>
      {favorites.length === 0 ? (
        <p className="text-center text-muted fs-5">คุณยังไม่มีอุปกรณ์ในรายการโปรด</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {favorites.map(device => (
            <div className="col" key={device._id}>
              <div 
                className="card h-100 border-0 shadow-sm card-clickable"
                onClick={() => navigate(`/devices/${device._id}`)}
                role="button"
                tabIndex="0"
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/devices/${device._id}`)}
                aria-label={`ดูรายละเอียด ${device.name}`}
              >
                <img 
                  src={device.imageUrl} 
                  className="card-img-top" 
                  alt={`รูปภาพของ ${device.name}`} 
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/200x150?text=Image+Not+Found'; }}
                />
                <div className="card-body">
                  <h5 className="card-title text-primary fs-5">{device.name}</h5>
                  <p className="card-text text-muted">{device.description.substring(0, 100)}...</p>
                  <p className="card-text fw-bold text-success">ราคา: {device.price.toLocaleString()} บาท</p>
                  <button
                    className="btn btn-star btn-outline-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromFavorites(device._id);
                    }}
                    disabled={removeLoading[device._id]}
                    aria-label="ลบออกจากรายการโปรด"
                  >
                    {removeLoading[device._id] ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                      '❌'
                    )}
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