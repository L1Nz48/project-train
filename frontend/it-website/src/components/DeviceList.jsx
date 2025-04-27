import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from './Loading';


function DeviceList({ devices: initialDevices }) {
  const [devices, setDevices] = useState(initialDevices);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [favoriteLoading, setFavoriteLoading] = useState({});
  const isLoggedIn = !!localStorage.getItem('token');
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'https://project-train.onrender.com';

  useEffect(() => {
    setDevices(initialDevices);
    if (isLoggedIn) {
      fetchFavorites();
    }
  }, [initialDevices, isLoggedIn]);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/favorites`, {
        headers: { 'Authorization': `Bearer ${token}` },
        signal: AbortSignal.timeout(30000),
      });
      const data = await res.json();
      if (res.ok) {
        setFavorites(data.map(fav => fav._id));
      } else {
        toast.error(data.message || 'เกิดข้อผิดพลาดในการดึงรายการโปรด', { position: 'top-right' });
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
      toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อ', { position: 'top-right' });
    }
  };

  const filterDevices = async (category) => {
    setSelectedCategory(category);
    setLoading(true);
    try {
      const url = category === 'all' 
        ? `${API_URL}/devices` 
        : `${API_URL}/devices?category=${encodeURIComponent(category)}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
      const data = await res.json();
      if (res.ok) {
        setDevices(data);
      } else {
        toast.error(data.message || 'เกิดข้อผิดพลาดในการกรองอุปกรณ์', { position: 'top-right' });
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อ', { position: 'top-right' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = initialDevices.filter(device =>
      device.name.toLowerCase().includes(query) ||
      device.brand.toLowerCase().includes(query) ||
      device.model.toLowerCase().includes(query)
    );
    setDevices(filtered);
  };

  const addToFavorites = async (deviceId) => {
    if (favoriteLoading[deviceId]) return;
    setFavoriteLoading(prev => ({ ...prev, [deviceId]: true }));
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ deviceId }),
        signal: AbortSignal.timeout(30000),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'เพิ่มในรายการโปรดสำเร็จ', { position: 'top-right' });
        setFavorites([...favorites, deviceId]);
      } else {
        toast.error(data.message || 'เกิดข้อผิดพลาด', { position: 'top-right' });
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อ', { position: 'top-right' });
    } finally {
      setFavoriteLoading(prev => ({ ...prev, [deviceId]: false }));
    }
  };

  const categories = useMemo(() => ['all', ...new Set(initialDevices.map(device => device.category))], [initialDevices]);

  return (
    <div className="container my-5">
      {loading && <Loading />}
      <h2 className="text-center mb-4 fw-bold text-primary fs-4">รายการอุปกรณ์ IT</h2>
      
      <div className="mb-4 search-container">
        <input
          type="text"
          className="form-control search-input"
          placeholder="ค้นหาอุปกรณ์ตามชื่อ, ยี่ห้อ, หรือรุ่น..."
          value={searchQuery}
          onChange={handleSearch}
          aria-label="ค้นหาอุปกรณ์"
        />
      </div>

      <div className="mb-4 text-center">
        <div className="btn-group">
          {categories.map(category => (
            <button
              key={category}
              className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-outline-primary'} mx-1`}
              onClick={() => filterDevices(category)}
              aria-label={`กรองตามหมวดหมู่ ${category === 'all' ? 'ทั้งหมด' : category}`}
            >
              {category === 'all' ? 'ทั้งหมด' : category}
            </button>
          ))}
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {devices.map(device => (
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
                {isLoggedIn && (
                  favorites.includes(device._id) ? (
                    <button className="btn btn-star btn-secondary" disabled aria-label="อยู่ในรายการโปรด">
                      ★
                    </button>
                  ) : (
                    <button
                      className="btn btn-star btn-outline-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToFavorites(device._id);
                      }}
                      disabled={favoriteLoading[device._id]}
                      aria-label="เพิ่มในรายการโปรด"
                    >
                      {favoriteLoading[device._id] ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      ) : (
                        '☆'
                      )}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DeviceList;