const Room = require('../models/Room');
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
};