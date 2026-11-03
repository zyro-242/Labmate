import { useCallback, useEffect, useState } from 'react';
import AdminApprovalTable from '../components/AdminApprovalTable';
import UsageChart from '../components/UsageChart';
import { api } from '../services/api';

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    try {
      const [bookingResult, statsResult] = await Promise.all([api.bookings(), api.stats()]);
      setBookings(bookingResult.bookings);
      setStats(statsResult);
      setError('');
    } catch (loadError) {
      setError(loadError.message);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  async function updateBooking(id, status) {
    setBusyId(id);
    setError('');
    try {
      await api.updateBooking(id, status);
      await loadData();
    } catch (updateError) {
      setError(updateError.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="page-shell">
      <section className="page-heading"><div><span className="eyebrow">LAB MANAGER · TỔNG QUAN</span><h1>Quản trị <span>phòng lab.</span></h1><p>Điều phối yêu cầu và theo dõi hiệu suất sử dụng không gian nghiên cứu.</p></div><span className="live-badge"><i /> DEMO LIVE</span></section>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="admin-stats">
        <article><span className="admin-stat-icon icon-amber">◷</span><div><small>Đang chờ duyệt</small><strong>{stats?.pending ?? '—'}</strong></div><span className="stat-caption">Cần xử lý</span></article>
        <article><span className="admin-stat-icon icon-green">✓</span><div><small>Đã được duyệt</small><strong>{stats?.approved ?? '—'}</strong></div><span className="stat-caption">Tổng đơn</span></article>
        <article><span className="admin-stat-icon icon-blue">▦</span><div><small>Phòng thí nghiệm</small><strong>{stats?.rooms.length ?? '—'}</strong></div><span className="stat-caption">Đang hoạt động</span></article>
      </div>
      <section className="panel-section">
        <div className="section-title"><div><h2>Yêu cầu đặt phòng</h2><p>Xem xét và xử lý các yêu cầu từ người dùng.</p></div><span className="pending-count">{stats?.pending ?? 0} CHỜ DUYỆT</span></div>
        <AdminApprovalTable bookings={bookings} onUpdate={updateBooking} busyId={busyId} />
      </section>
      <section className="panel-section usage-panel">
        <div className="section-title"><div><h2>Tần suất sử dụng phòng</h2><p>Tổng thời lượng đặt đã duyệt · 5 ngày làm việc gần nhất</p></div><span className="room-count">TUẦN NÀY</span></div>
        {stats ? <UsageChart rooms={stats.rooms} /> : <div className="loading-state">Đang tải thống kê…</div>}
      </section>
    </main>
  );
}
