const fs = require('fs');
const path = require('path');

const files = {
  'backend/.env': `PORT=5000\nMONGO_URI=mongodb://localhost:27017/hoteldb\nJWT_SECRET=your_super_secret_key_123`,
  'backend/server.js': `const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/rooms',    require('./routes/roomRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.listen(process.env.PORT || 5000, () => console.log('Server running'));`,

  'backend/config/db.js': `const mongoose = require('mongoose');
const connectDB = async () => {
  try { await mongoose.connect(process.env.MONGO_URI); console.log('MongoDB Connected'); }
  catch (e) { console.error(e.message); process.exit(1); }
};
module.exports = connectDB;`,

  'backend/models/User.js': `const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['user','admin'], default: 'user' }
}, { timestamps: true });
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10); next();
});
userSchema.methods.matchPassword = function(p) { return bcrypt.compare(p, this.password); };
module.exports = mongoose.model('User', userSchema);`,

  'backend/models/Room.js': `const mongoose = require('mongoose');
const roomSchema = new mongoose.Schema({
  roomNumber:  { type: String, required: true, unique: true },
  type:        { type: String, enum: ['Single','Double','Suite'], required: true },
  price:       { type: Number, required: true },
  amenities:   [String],
  isAvailable: { type: Boolean, default: true },
  imageUrl:    { type: String, default: '' },
  description: { type: String, default: '' }
}, { timestamps: true });
module.exports = mongoose.model('Room', roomSchema);`,

  'backend/models/Booking.js': `const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room:       { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  checkIn:    { type: Date, required: true },
  checkOut:   { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  status:     { type: String, enum: ['confirmed','cancelled','completed'], default: 'confirmed' }
}, { timestamps: true });
module.exports = mongoose.model('Booking', bookingSchema);`,

  'backend/middleware/authMiddleware.js': `const jwt = require('jsonwebtoken');
const User = require('../models/User');
const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch { res.status(401).json({ message: 'Token invalid' }); }
};
const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  next();
};
module.exports = { protect, adminOnly };`,

  'backend/controllers/authController.js': `const jwt = require('jsonwebtoken');
const User = require('../models/User');
const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    if (await User.findOne({ email })) return res.status(400).json({ message: 'Email exists' });
    const user = await User.create({ name, email, password, role });
    res.status(201).json({ token: genToken(user._id), user: { id: user._id, name, email, role: user.role } });
  } catch(e) { res.status(500).json({ message: e.message }); }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ token: genToken(user._id), user: { id: user._id, name: user.name, email, role: user.role } });
  } catch(e) { res.status(500).json({ message: e.message }); }
};`,

  'backend/controllers/roomController.js': `const Room = require('../models/Room');
exports.getAllRooms = async (req, res) => res.json(await Room.find());
exports.getRoomById = async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) return res.status(404).json({ message: 'Not found' });
  res.json(room);
};
exports.createRoom = async (req, res) => {
  try { res.status(201).json(await Room.create(req.body)); }
  catch(e) { res.status(400).json({ message: e.message }); }
};
exports.updateRoom = async (req, res) => {
  const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!room) return res.status(404).json({ message: 'Not found' });
  res.json(room);
};
exports.deleteRoom = async (req, res) => {
  await Room.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};`,

  'backend/controllers/bookingController.js': `const Booking = require('../models/Booking');
const Room = require('../models/Room');
exports.createBooking = async (req, res) => {
  const { roomId, checkIn, checkOut } = req.body;
  try {
    const room = await Room.findById(roomId);
    if (!room || !room.isAvailable) return res.status(400).json({ message: 'Not available' });
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000);
    if (nights <= 0) return res.status(400).json({ message: 'Invalid dates' });
    const booking = await Booking.create({ user: req.user._id, room: roomId, checkIn, checkOut, totalPrice: room.price * nights });
    await Room.findByIdAndUpdate(roomId, { isAvailable: false });
    res.status(201).json(booking);
  } catch(e) { res.status(500).json({ message: e.message }); }
};
exports.getMyBookings = async (req, res) => res.json(await Booking.find({ user: req.user._id }).populate('room','roomNumber type price'));
exports.getAllBookings = async (req, res) => res.json(await Booking.find().populate('user','name email').populate('room','roomNumber type'));
exports.cancelBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Not found' });
  if (booking.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not yours' });
  booking.status = 'cancelled'; await booking.save();
  await Room.findByIdAndUpdate(booking.room, { isAvailable: true });
  res.json({ message: 'Cancelled' });
};`,

  'backend/routes/authRoutes.js': `const router = require('express').Router();
const { register, login } = require('../controllers/authController');
router.post('/register', register);
router.post('/login', login);
module.exports = router;`,

  'backend/routes/roomRoutes.js': `const router = require('express').Router();
const { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom } = require('../controllers/roomController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
router.get('/', getAllRooms);
router.get('/:id', getRoomById);
router.post('/', protect, adminOnly, createRoom);
router.put('/:id', protect, adminOnly, updateRoom);
router.delete('/:id', protect, adminOnly, deleteRoom);
module.exports = router;`,

  'backend/routes/bookingRoutes.js': `const router = require('express').Router();
const { createBooking, getMyBookings, getAllBookings, cancelBooking } = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/', protect, adminOnly, getAllBookings);
router.put('/:id/cancel', protect, cancelBooking);
module.exports = router;`,
};

for (const [filePath, content] of Object.entries(files)) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content);
  console.log('✅ Created:', filePath);
}

console.log('\n🎉 All backend files created!');
console.log('👉 Next: cd backend && npm init -y && npm install express mongoose dotenv bcryptjs jsonwebtoken cors nodemon');
