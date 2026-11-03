const { db } = require('../db');
const { hasTimeConflict, isValidTimeRange } = require('../utils/timeConflict');

function listBookings(req, res) {
  const { userId } = req.query;
  const where = userId ? 'WHERE b.user_id = ?' : '';
  const bookings = userId
    ? db.prepare(`
        SELECT b.*, l.name AS lab_name, l.building, u.name AS user_name
        FROM bookings b
        JOIN labs l ON l.id = b.lab_id
        JOIN users u ON u.id = b.user_id
        ${where}
        ORDER BY b.booking_date DESC, b.start_time
      `).all(userId)
    : db.prepare(`
        SELECT b.*, l.name AS lab_name, l.building, u.name AS user_name
        FROM bookings b
        JOIN labs l ON l.id = b.lab_id
        JOIN users u ON u.id = b.user_id
        ORDER BY CASE b.status WHEN 'pending' THEN 0 ELSE 1 END,
                 b.booking_date, b.start_time
      `).all();
  return res.json({ bookings });
}

function createBooking(req, res) {
  const { userId, labId, date, startTime, endTime, purpose } = req.body;
  if (!userId || !labId || !date || !purpose?.trim()) {
    return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin đặt phòng.' });
  }
  const parsedDate = /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(`${date}T00:00:00.000Z`) : null;
  if (!parsedDate || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date) {
    return res.status(400).json({ error: 'Ngày đặt phòng không hợp lệ.' });
  }
  if (!isValidTimeRange(startTime, endTime)) {
    return res.status(400).json({ error: 'Giờ kết thúc phải sau giờ bắt đầu.' });
  }
  const user = db.prepare('SELECT id FROM users WHERE id = ?').get(userId);
  const room = db.prepare('SELECT id FROM labs WHERE id = ?').get(labId);
  if (!user || !room) return res.status(404).json({ error: 'Không tìm thấy người dùng hoặc phòng lab.' });

  try {
    const result = db.transaction(() => {
      const existing = db.prepare(`
        SELECT start_time, end_time FROM bookings
        WHERE lab_id = ? AND booking_date = ? AND status != 'rejected'
      `).all(labId, date);
      if (hasTimeConflict(startTime, endTime, existing)) {
        const error = new Error('Phòng đã có lịch trong khung giờ này. Vui lòng chọn giờ khác.');
        error.status = 409;
        throw error;
      }

      return db.prepare(`
        INSERT INTO bookings (user_id, lab_id, booking_date, start_time, end_time, purpose)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(userId, labId, date, startTime, endTime, purpose.trim());
    })();

    return res.status(201).json({ bookingId: result.lastInsertRowid, message: 'Đã gửi yêu cầu đặt phòng.' });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ error: error.message });
    console.error('Create booking failed:', error);
    return res.status(500).json({ error: 'Không thể tạo yêu cầu đặt phòng.' });
  }
}

function updateBookingStatus(req, res) {
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Trạng thái duyệt không hợp lệ.' });
  }

  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
  if (!booking) return res.status(404).json({ error: 'Không tìm thấy đơn đặt phòng.' });
  if (booking.status !== 'pending') {
    return res.status(409).json({ error: 'Đơn này đã được xử lý trước đó.' });
  }

  if (status === 'approved') {
    const otherBookings = db.prepare(`
      SELECT start_time, end_time FROM bookings
      WHERE lab_id = ? AND booking_date = ? AND status = 'approved' AND id != ?
    `).all(booking.lab_id, booking.booking_date, booking.id);
    if (hasTimeConflict(booking.start_time, booking.end_time, otherBookings)) {
      return res.status(409).json({ error: 'Lịch đã trùng với một đơn được duyệt khác.' });
    }
  }

  db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, booking.id);
  return res.json({ message: status === 'approved' ? 'Đã duyệt đơn đặt phòng.' : 'Đã từ chối đơn đặt phòng.' });
}

module.exports = { createBooking, listBookings, updateBookingStatus };
