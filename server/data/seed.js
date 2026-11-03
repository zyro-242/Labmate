const path = require('node:path');
const Database = require('better-sqlite3');

const databasePath = path.join(__dirname, 'labmate.sqlite');

function dateOffset(offset) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function seed(db) {
  db.exec(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'manager'))
    );
    CREATE TABLE IF NOT EXISTS labs (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      building TEXT NOT NULL,
      capacity INTEGER NOT NULL,
      equipment TEXT NOT NULL,
      description TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      lab_id INTEGER NOT NULL REFERENCES labs(id),
      booking_date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      purpose TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'approved', 'rejected')),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS bookings_lab_date_idx
      ON bookings(lab_id, booking_date, status);
    CREATE INDEX IF NOT EXISTS bookings_user_date_idx
      ON bookings(user_id, booking_date);
  `);

  if (db.prepare('SELECT COUNT(*) AS count FROM labs').get().count > 0) return;

  const insertUser = db.prepare('INSERT INTO users (id, name, email, role) VALUES (?, ?, ?, ?)');
  const insertLab = db.prepare(`
    INSERT INTO labs (id, name, building, capacity, equipment, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const insertBooking = db.prepare(`
    INSERT INTO bookings (user_id, lab_id, booking_date, start_time, end_time, purpose, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  db.transaction(() => {
    [
      [1, 'Nguyễn Minh Anh', 'sv01@labmate.vn', 'student'],
      [2, 'Trần Hoàng Nam', 'gv01@labmate.vn', 'teacher'],
      [3, 'Lê Thu Hà', 'ql01@labmate.vn', 'manager']
    ].forEach((user) => insertUser.run(...user));

    [
      [1, 'AI & Machine Learning', 'Tòa A · Tầng 3', 24, 'GPU workstation, Robot kit', 'Không gian nghiên cứu trí tuệ nhân tạo và thị giác máy tính.'],
      [2, 'IoT Innovation Lab', 'Tòa A · Tầng 2', 18, 'Arduino, ESP32, Sensor kit', 'Phòng thực hành hệ thống nhúng và Internet vạn vật.'],
      [3, 'Robotics Studio', 'Tòa B · Tầng 1', 20, 'Robot arm, 3D printer', 'Không gian chế tạo, thử nghiệm robot và sản phẩm mẫu.'],
      [4, 'Data Science Lab', 'Tòa B · Tầng 2', 30, 'Workstation, Smart display', 'Phòng học nhóm cho phân tích dữ liệu và khoa học máy tính.'],
      [5, 'Biochemistry Lab', 'Tòa C · Tầng 1', 16, 'Microscope, Safety cabinet', 'Phòng thí nghiệm sinh hóa với trang thiết bị an toàn.']
    ].forEach((lab) => insertLab.run(...lab));

    [
      [2, 1, dateOffset(0), '09:00', '11:00', 'Hướng dẫn nhóm nghiên cứu AI', 'approved'],
      [1, 2, dateOffset(0), '13:00', '15:00', 'Thực hành cảm biến môi trường', 'pending'],
      [1, 3, dateOffset(1), '10:00', '12:00', 'Thiết kế robot tự hành', 'approved'],
      [2, 4, dateOffset(1), '14:00', '16:00', 'Seminar phân tích dữ liệu', 'pending']
    ].forEach((booking) => insertBooking.run(...booking));
  })();
}

if (require.main === module) {
  const db = new Database(databasePath);
  seed(db);
  db.close();
  console.log(`Database seeded: ${databasePath}`);
}

module.exports = { databasePath, seed };
