const { db } = require('../db');

function login(req, res) {
  const { role } = req.body;
  if (!['student', 'teacher', 'manager'].includes(role)) {
    return res.status(400).json({ error: 'Vui lòng chọn một vai trò hợp lệ.' });
  }

  const user = db.prepare('SELECT id, name, email, role FROM users WHERE role = ?').get(role);
  if (!user) return res.status(404).json({ error: 'Không tìm thấy tài khoản mẫu.' });
  return res.json({ user });
}

module.exports = { login };
