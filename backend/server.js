require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

// เชื่อมต่อ MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB Atlas connection error:', err));

// Middleware
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'ไม่มี token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'token ไม่ถูกต้อง' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'ไม่มีสิทธิ์' });
  next();
};

// Device Schema
const deviceSchema = new mongoose.Schema({
  name: String,
  category: String,
  brand: String,
  model: String,
  description: String,
  price: Number,
  imageUrl: String
});
const Device = mongoose.model('Device', deviceSchema);

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// Favorite Schema
const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' }
});
const Favorite = mongoose.model('Favorite', favoriteSchema);

// Routes
app.get('/devices', async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};
    const devices = await Device.find(query);
    res.json(devices);
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

app.get('/devices/:id', async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) return res.status(404).json({ message: 'ไม่พบอุปกรณ์' });
    res.json(device);
  } catch (err) {
    res.status(404).json({ message: 'ไม่พบอุปกรณ์' });
  }
});

app.post('/devices', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const newDevice = new Device(req.body);
    await newDevice.save();
    res.json(newDevice);
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

app.put('/devices/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const updatedDevice = await Device.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDevice) return res.status(404).json({ message: 'ไม่พบอุปกรณ์' });
    res.json(updatedDevice);
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

app.delete('/devices/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deletedDevice = await Device.findByIdAndDelete(req.params.id);
    if (!deletedDevice) return res.status(404).json({ message: 'ไม่พบอุปกรณ์' });
    res.send('Device deleted');
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

app.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'ชื่อผู้ใช้นี้มีอยู่แล้ว' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role: role || 'user' });
    await newUser.save();
    res.json({ message: 'ลงทะเบียนสำเร็จ' });
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลงทะเบียน' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'ไม่พบผู้ใช้' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'รหัสผ่านไม่ถูกต้อง' });

    const token = jwt.sign({ id: user._id, role: user.role, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role, username: user.username });
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการล็อกอิน' });
  }
});

app.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

app.put('/profile', authMiddleware, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'ไม่พบผู้ใช้' });

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'กรุณากรอกรหัสผ่านเก่าและรหัสผ่านใหม่' });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'รหัสผ่านเก่าไม่ถูกต้อง' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await User.findByIdAndUpdate(req.user.id, { password: hashedPassword }, { new: true }).select('-password');
    res.json({ message: 'อัปเดตรหัสผ่านสำเร็จ', user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดต' });
  }
});

// Favorites Routes
app.post('/favorites', authMiddleware, async (req, res) => {
  const { deviceId } = req.body;
  try {
    const existingFavorite = await Favorite.findOne({ userId: req.user.id, deviceId });
    if (existingFavorite) {
      return res.status(400).json({ message: 'อุปกรณ์นี้อยู่ในรายการโปรดแล้ว' });
    }
    const favorite = new Favorite({ userId: req.user.id, deviceId });
    await favorite.save();
    res.status(201).json({ message: 'เพิ่มไปยังรายการโปรดสำเร็จ' });
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

app.get('/favorites', authMiddleware, async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user.id }).populate('deviceId');
    res.json(favorites.map(fav => fav.deviceId));
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

app.delete('/favorites/:deviceId', authMiddleware, async (req, res) => {
  const { deviceId } = req.params;
  try {
    const favorite = await Favorite.findOneAndDelete({ userId: req.user.id, deviceId });
    if (!favorite) {
      return res.status(404).json({ message: 'ไม่พบอุปกรณ์นี้ในรายการโปรด' });
    }
    res.json({ message: 'ลบออกจากรายการโปรดสำเร็จ' });
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

// Users Stats (เฉพาะ admin)
app.get('/users/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const regularUsers = await User.countDocuments({ role: 'user' });
    res.json({
      total: totalUsers,
      admins: adminUsers,
      users: regularUsers
    });
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการนับจำนวนผู้ใช้' });
  }
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});