import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const API_URL = import.meta.env.VITE_API_URL || 'https://project-train.onrender.com';
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'กรุณากรอกชื่ออุปกรณ์';
    if (!formData.category) newErrors.category = 'กรุณากรอกหมวดหมู่';
    if (!formData.brand) newErrors.brand = 'กรุณากรอกยี่ห้อ';
    if (!formData.model) newErrors.model = 'กรุณากรอกรุ่น';
    if (!formData.description) newErrors.description = 'กรุณากรอกรายละเอียด';
    if (!formData.price || formData.price <= 0) newErrors.price = 'กรุณากรอกราคาที่ถูกต้อง';
    if (!formData.imageUrl || !/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(formData.imageUrl))
      newErrors.imageUrl = 'กรุณากรอก URL รูปภาพที่ถูกต้อง';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/devices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
        signal: AbortSignal.timeout(30000),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('เพิ่มอุปกรณ์สำเร็จ!', { position: 'top-right' });
        setFormData({ name: '', category: '', brand: '', model: '', description: '', price: '', imageUrl: '' });
        setTimeout(() => navigate('/devices'), 1500);
      } else {
        toast.error(data.message || 'เกิดข้อผิดพลาด', { position: 'top-right' });
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อ', { position: 'top-right' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 fw-bold text-primary">เพิ่มอุปกรณ์ใหม่</h2>
      <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="name" className="form-label fw-bold">ชื่ออุปกรณ์</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              required
              aria-describedby="nameError"
            />
            {errors.name && <div id="nameError" className="invalid-feedback">{errors.name}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="category" className="form-label fw-bold">หมวดหมู่</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`form-control ${errors.category ? 'is-invalid' : ''}`}
              required
              aria-describedby="categoryError"
            />
            {errors.category && <div id="categoryError" className="invalid-feedback">{errors.category}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="brand" className="form-label fw-bold">ยี่ห้อ</label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className={`form-control ${errors.brand ? 'is-invalid' : ''}`}
              required
              aria-describedby="brandError"
            />
            {errors.brand && <div id="brandError" className="invalid-feedback">{errors.brand}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="model" className="form-label fw-bold">รุ่น</label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className={`form-control ${errors.model ? 'is-invalid' : ''}`}
              required
              aria-describedby="modelError"
            />
            {errors.model && <div id="modelError" className="invalid-feedback">{errors.model}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label fw-bold">รายละเอียด</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`form-control ${errors.description ? 'is-invalid' : ''}`}
              required
              aria-describedby="descriptionError"
              rows="4"
            />
            {errors.description && <div id="descriptionError" className="invalid-feedback">{errors.description}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="price" className="form-label fw-bold">ราคา</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`form-control ${errors.price ? 'is-invalid' : ''}`}
              required
              min="0"
              step="0.01"
              aria-describedby="priceError"
            />
            {errors.price && <div id="priceError" className="invalid-feedback">{errors.price}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="imageUrl" className="form-label fw-bold">URL รูปภาพ</label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className={`form-control ${errors.imageUrl ? 'is-invalid' : ''}`}
              required
              aria-describedby="imageUrlError"
            />
            {errors.imageUrl && <div id="imageUrlError" className="invalid-feedback">{errors.imageUrl}</div>}
            {formData.imageUrl && (
              <div className="mt-2">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="img-fluid rounded"
                  style={{ maxHeight: '100px' }}
                  onError={() => toast.error('ไม่สามารถโหลดรูปภาพได้', { position: 'top-right' })}
                />
              </div>
            )}
          </div>
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary flex-grow-1" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  กำลังเพิ่ม...
                </>
              ) : (
                'เพิ่มอุปกรณ์'
              )}
            </button>
            <Link to="/devices" className="btn btn-secondary flex-grow-1">ยกเลิก</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminForm;