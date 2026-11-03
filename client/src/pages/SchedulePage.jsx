import { useCallback, useEffect, useState } from 'react';
import BookingModal from '../components/BookingModal';
import RoomGrid from '../components/RoomGrid';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

function localDate(date = new Date()) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

export default function SchedulePage() {
  const { user } = useAuth();
  const [date, setDate] = useState(localDate());
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);

  const loadRooms = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await api.rooms(date);
      setRooms(result.rooms);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => { loadRooms(); }, [loadRooms]);

  async function submitBooking(form) {
    await api.createBooking({ userId: user.id, labId: selectedRoom.id, date, ...form });
    setSelectedRoom(null);
    setNotice('Yêu cầu đã gửi! Bạn có thể theo dõi trạng thái trong mục “Đơn của tôi”.');
    await loadRooms();
  }

  return (
    <main className="page-shell">
      <section className="page-heading schedule-heading">
        <div><span className="eyebrow">KHÔNG GIAN NGHIÊN CỨU</span><h1>Tìm phòng lab <span>của bạn.</span></h1><p>Chọn phòng phù hợp và gửi yêu cầu đặt lịch chỉ trong vài bước.</p></div>
        <label className="date-picker"><span>NGÀY SỬ DỤNG</span><input type="date" value={date} onChange={(event) => { setNotice(''); setDate(event.target.value); }} /></label>
      </section>
      <div className="quick-stats">
        <div><span className="quick-icon">▦</span><p><strong>{rooms.length}</strong><small>Phòng thí nghiệm</small></p></div>
        <div><span className="quick-icon quick-icon-green">◷</span><p><strong>{rooms.filter((room) => room.bookings.length === 0).length}</strong><small>Phòng chưa có lịch duyệt</small></p></div>
        <div><span className="quick-icon quick-icon-purple">⌖</span><p><strong>08:00 – 18:00</strong><small>Khung giờ hoạt động</small></p></div>
      </div>
      {notice && <div className="notice" role="status">{notice}<button onClick={() => setNotice('')} aria-label="Đóng">×</button></div>}
      <div className="section-title"><div><h2>Danh sách phòng</h2><p>Lịch hiển thị gồm các yêu cầu đã được duyệt.</p></div><span className="room-count">{rooms.length} PHÒNG</span></div>
      {error && <p className="form-error" role="alert">{error}</p>}
      {loading ? <div className="loading-state">Đang tải danh sách phòng…</div> : <RoomGrid rooms={rooms} onBook={setSelectedRoom} />}
      <footer className="page-footer"><span>LABMATE · QUẢN LÝ KHÔNG GIAN NGHIÊN CỨU</span><span>Đặt lịch có trách nhiệm · Cùng tạo nên đổi mới</span></footer>
      {selectedRoom && <BookingModal room={selectedRoom} date={date} onClose={() => setSelectedRoom(null)} onSubmit={submitBooking} />}
    </main>
  );
}
