const express = require('express');
const {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus
} = require('../controllers/bookingController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createBooking);
router.get('/user/my-bookings', authMiddleware, getUserBookings);
router.get('/:id', authMiddleware, getBookingById);
router.put('/:id/cancel', authMiddleware, cancelBooking);
router.get('/', authMiddleware, adminMiddleware, getAllBookings);
router.put('/:id/status', authMiddleware, adminMiddleware, updateBookingStatus);

module.exports = router;
