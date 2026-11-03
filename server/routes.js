const express = require('express');
const { login } = require('./controllers/authController');
const { createBooking, listBookings, updateBookingStatus } = require('./controllers/bookingController');
const { getStats, listRooms } = require('./controllers/roomController');

const router = express.Router();

router.post('/auth/login', login);
router.get('/rooms', listRooms);
router.get('/stats', getStats);
router.get('/bookings', listBookings);
router.post('/bookings', createBooking);
router.patch('/bookings/:id/status', updateBookingStatus);

module.exports = router;
