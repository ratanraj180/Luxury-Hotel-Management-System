const Room = require('../models/Room');

const getAllCities = async (req, res) => {
  try {
    const cities = await Room.distinct('city');
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllRooms = async (req, res) => {
  try {
    const { type, priceMin, priceMax, city } = req.query;
    let filter = {};

    if (type) filter.type = type;
    if (city) filter.city = city;
    if (priceMin || priceMax) {
      filter.pricePerNight = {};
      if (priceMin) filter.pricePerNight.$gte = priceMin;
      if (priceMax) filter.pricePerNight.$lte = priceMax;
    }

    const rooms = await Room.find(filter);
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createRoom = async (req, res) => {
  try {
    const { hotelName, city, roomNumber, type, capacity, pricePerNight, description, amenities, image } = req.body;

    const room = new Room({
      hotelName,
      city,
      roomNumber,
      type,
      capacity,
      pricePerNight,
      description,
      amenities,
      image
    });

    await room.save();
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRoom = async (req, res) => {
  try {
    let room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllCities, getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom };
