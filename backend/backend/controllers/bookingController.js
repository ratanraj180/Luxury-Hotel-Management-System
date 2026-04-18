const Booking = require('../models/Booking');
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
};