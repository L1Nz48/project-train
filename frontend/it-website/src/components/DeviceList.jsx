import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // เพิ่ม useNavigate
import { toast } from 'react-toastify';
import Loading from './Loading';
import '../index.css';

function DeviceList({ devices: initialDevices }) {
  const [devices, setDevices] = useState(initialDevices);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const isLoggedIn = !!localStorage.getItem('token');
  const navigate = useNavigate(); // เพิ่ม navigate

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    setDevices(initialDevices);
    if (isLoggedIn) {
      fetchFavorites();
    }
  }, [initialDevices, isLoggedIn]);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('${API_URL}/favorites', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setFavorites(data.map(fav => fav._id));
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };

  const filterDevices = async (category) => {
    setSelectedCategory(category);
    setLoading(true);
    try {
      const url = category === 'all' 
        ? '${API_URL}:5000/devices' 
        : `${API_URL}/devices?category=${encodeURIComponent(category)}`;
      const res = await fetch(url);
      const data = await res.json();
      setDevices(data);
    } catch (err) {
      console.error('Error:', err);
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
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('${API_URL}/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ deviceId }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message, { position: 'top-right' });
        setFavorites([...favorites, deviceId]);
      } else {
        toast.error(data.message, { position: 'top-right' });
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อ', { position: 'top-right' });
    }
  };

  const categories = ['all', ...new Set(initialDevices.map(device => device.category))];

  return (
    <div className="container mt-5">
      {loading && <Loading />}
      <h2 className="text-center mb-4 fw-bold text-primary">รายการอุปกรณ์ IT</h2>
      
      <div className="mb-4 position-relative" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <input
          type="text"
          className="form-control search-input"
          placeholder="ค้นหาอุปกรณ์ตามชื่อ, ยี่ห้อ, หรือรุ่น..."
          value={searchQuery}
          onChange={handleSearch}
        />
        <span className="search-icon"></span>
      </div>

      <div className="mb-4 text-center">
        <div className="btn-group" role="group">
          {categories.map(category => (
            <button
              key={category}
              className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-outline-primary'} mx-1`}
              onClick={() => filterDevices(category)}
            >
              {category === 'all' ? 'ทั้งหมด' : category}
            </button>
          ))}
        </div>
      </div>

      <div className="row">
        {devices.map(device => (
          <div className="col-md-4 mb-4" key={device._id}>
            <div 
              className="card h-100 border-0 shadow-sm card-clickable" // เพิ่มคลาส card-clickable
              onClick={() => navigate(`/devices/${device._id}`)} // คลิกไปหน้ารายละเอียด
            >
              <img src={device.imageUrl} className="card-img-top" alt={device.name} style={{ height: '200px', objectFit: 'cover' }} />
              <div className="card-body">
                <h5 className="card-title text-primary">{device.name}</h5>
                <p className="card-text text-muted">{device.description.substring(0, 100)}...</p>
                <p className="card-text fw-bold text-success">ราคา: {device.price.toLocaleString()} บาท</p>
                {isLoggedIn && (
                  favorites.includes(device._id) ? (
                    <button className="btn btn-star btn-secondary" disabled>
                      ★
                    </button>
                  ) : (
                    <button
                      className="btn btn-star btn-outline-secondary"
                      onClick={(e) => {
                        e.stopPropagation(); // ป้องกันการคลิก card
                        addToFavorites(device._id);
                      }}
                    >
                      ☆
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