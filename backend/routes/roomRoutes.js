const express = require('express');
const {
  getAllCities,
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
} = require('../controllers/roomController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/cities', getAllCities);
router.get('/', getAllRooms);
router.get('/:id', getRoomById);
router.post('/', authMiddleware, adminMiddleware, createRoom);
router.put('/:id', authMiddleware, adminMiddleware, updateRoom);
router.delete('/:id', authMiddleware, adminMiddleware, deleteRoom);

module.exports = router;
