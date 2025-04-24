import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function AdminForm() {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    model: '',
    description: '',
    price: '',
    imageUrl: '',
  });

  const API_URL = import.meta.env.VITE_API_URL || 'https://project-train.onrender.com';

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/devices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success('เพิ่มอุปกรณ์สำเร็จ!', { position: 'top-right' });
        setFormData({ name: '', category: '', brand: '', model: '', description: '', price: '', imageUrl: '' });
      } else {
        toast.error('เกิดข้อผิดพลาด', { position: 'top-right' });
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อ', { position: 'top-right' });
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 fw-bold text-primary">เพิ่มอุปกรณ์ใหม่</h2>
      <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">ชื่ออุปกรณ์</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">หมวดหมู่</label>
            <input type="text" name="category" value={formData.category} onChange={handleChange} className="form-control" required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">ยี่ห้อ</label>
            <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="form-control" required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">รุ่น</label>
            <input type="text" name="model" value={formData.model} onChange={handleChange} className="form-control" required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">รายละเอียด</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="form-control" required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">ราคา</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} className="form-control" required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">URL รูปภาพ</label>
            <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="form-control" required />
          </div>
          <button type="submit" className="btn btn-primary w-100">เพิ่มอุปกรณ์</button>
        </form>
      </div>
    </div>
  );
}

export default AdminForm;