const mongoose = require('mongoose');
const roomSchema = new mongoose.Schema({
  roomNumber:  { type: String, required: true, unique: true },
  type:        { type: String, enum: ['Single','Double','Suite'], required: true },
  price:       { type: Number, required: true },
  amenities:   [String],
  isAvailable: { type: Boolean, default: true },
  imageUrl:    { type: String, default: '' },
  description: { type: String, default: '' }
}, { timestamps: true });
module.exports = mongoose.model('Room', roomSchema);