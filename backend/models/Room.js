const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  hotelName: {
    type: String,
    required: [true, 'Please provide a hotel name'],
    default: 'Hotel Luxury Initial'
  },
  city: {
    type: String,
    required: [true, 'Please provide a city'],
    default: 'New York'
  },
  roomNumber: {
    type: String,
    required: [true, 'Please provide a room number'],
    unique: true
  },
  type: {
    type: String,
    enum: ['single', 'double', 'suite', 'deluxe'],
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  pricePerNight: {
    type: Number,
    required: [true, 'Please provide a price per night']
  },
  description: String,
  amenities: [String],
  isAvailable: {
    type: Boolean,
    default: true
  },
  image: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Room', roomSchema);
