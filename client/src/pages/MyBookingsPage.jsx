import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const statusLabel = { pending: 'Chờ duyệt', approved: 'Đã duyệt', rejected: 'Từ chối' };

export default function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    try {
      const result = await api.bookings(user.id);
      setBookings(result.bookings);
      setError('');
    } catch (loadError) {
      setError(loadError.message);
    }
  }, [user.id]);

  useEffect(() => { load(); }, [load]);

  return (
    <main className="page-shell">
      <section className="page-heading"><div><span className="eyebrow">THEO DÕI YÊU CẦU</span><h1>Đơn đặt <span>của tôi.</span></h1><p>Xem lại lịch sử và trạng thái các yêu cầu sử dụng phòng lab.</p></div></section>
      <div className="section-title"><div><h2>Lịch sử đặt phòng</h2><p>{bookings.length} yêu cầu đã gửi</p></div></div>
      {error && <p className="form-error" role="alert">{error}</p>}
      {!bookings.length && !error ? <div className="empty-panel"><span>◷</span><h3>Chưa có yêu cầu nào</h3><p>Chọn một phòng lab để gửi yêu cầu đặt lịch đầu tiên.</p></div> : (
        <div className="booking-list">
          {bookings.map((booking) => (
            <article className="booking-list-card" key={booking.id}>
              <div className="booking-date-block"><strong>{new Date(`${booking.booking_date}T00:00:00`).toLocaleDateString('vi-VN', { day: '2-digit' })}</strong><span>TH{new Date(`${booking.booking_date}T00:00:00`).getMonth() + 1}</span></div>
              <div className="booking-info"><h3>{booking.lab_name}</h3><p>{booking.building} · {booking.start_time}–{booking.end_time}</p><small>{booking.purpose}</small></div>
              <span className={`status status-${booking.status}`}>{statusLabel[booking.status]}</span>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
