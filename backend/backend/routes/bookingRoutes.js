const router = require('express').Router();
const { createBooking, getMyBookings, getAllBookings, cancelBooking } = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/', protect, adminOnly, getAllBookings);
router.put('/:id/cancel', protect, cancelBooking);
module.exports = router;