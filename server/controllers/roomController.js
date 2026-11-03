const { db } = require('../db');

function listRooms(req, res) {
  const date = req.query.date;
  const rooms = db.prepare('SELECT * FROM labs ORDER BY id').all();
  const bookings = date
    ? db.prepare(`
        SELECT b.id, b.lab_id, b.booking_date, b.start_time, b.end_time, b.purpose,
               b.status, u.name AS user_name
        FROM bookings b
        JOIN users u ON u.id = b.user_id
        WHERE b.booking_date = ? AND b.status = 'approved'
        ORDER BY b.start_time
      `).all(date)
    : [];
  const pendingCounts = date
    ? db.prepare(`
        SELECT lab_id, COUNT(*) AS count
        FROM bookings
        WHERE booking_date = ? AND status = 'pending'
        GROUP BY lab_id
      `).all(date)
    : [];
  const pendingByLab = new Map(pendingCounts.map((row) => [row.lab_id, row.count]));
  return res.json({
    rooms: rooms.map((room) => ({
      ...room,
      pendingCount: pendingByLab.get(room.id) || 0,
      bookings: bookings.filter((booking) => booking.lab_id === room.id)
    }))
  });
}

function getStats(_req, res) {
  const rooms = db.prepare('SELECT id, name FROM labs ORDER BY id').all();
  const usage = db.prepare(`
    SELECT lab_id, SUM(
      (CAST(substr(end_time, 1, 2) AS INTEGER) * 60 + CAST(substr(end_time, 4, 2) AS INTEGER))
      - (CAST(substr(start_time, 1, 2) AS INTEGER) * 60 + CAST(substr(start_time, 4, 2) AS INTEGER))
    ) AS minutes
    FROM bookings
    WHERE status = 'approved'
      AND booking_date >= date('now', 'weekday 0', '-6 days')
      AND booking_date <= date('now', 'weekday 0')
    GROUP BY lab_id
  `).all();
  const pending = db.prepare("SELECT COUNT(*) AS count FROM bookings WHERE status = 'pending'").get().count;
  const approved = db.prepare("SELECT COUNT(*) AS count FROM bookings WHERE status = 'approved'").get().count;
  const usageByLab = new Map(usage.map((row) => [row.lab_id, row.minutes || 0]));

  return res.json({
    pending,
    approved,
    rooms: rooms.map((room) => ({
      id: room.id,
      name: room.name,
      hours: Math.round((usageByLab.get(room.id) || 0) / 60 * 10) / 10,
      utilization: Math.min(100, Math.round((usageByLab.get(room.id) || 0) / (5 * 8 * 60) * 100))
    }))
  });
}

module.exports = { getStats, listRooms };
