const statusName = { pending: 'Chờ duyệt', approved: 'Đã duyệt', rejected: 'Từ chối' };

export default function AdminApprovalTable({ bookings, onUpdate, busyId }) {
  if (!bookings.length) return <div className="empty-state">Chưa có yêu cầu đặt phòng nào.</div>;
  return (
    <div className="table-wrap">
      <table className="approval-table">
        <thead><tr><th>NGƯỜI ĐẶT</th><th>PHÒNG LAB</th><th>THỜI GIAN</th><th>MỤC ĐÍCH</th><th>TRẠNG THÁI</th><th>THAO TÁC</th></tr></thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td><strong>{booking.user_name}</strong><small>{booking.booking_date}</small></td>
              <td>{booking.lab_name}<small>{booking.building}</small></td>
              <td><strong>{booking.start_time}–{booking.end_time}</strong><small>{booking.booking_date}</small></td>
              <td className="purpose-cell">{booking.purpose}</td>
              <td><span className={`status status-${booking.status}`}>{statusName[booking.status]}</span></td>
              <td>{booking.status === 'pending' ? (
                <div className="table-actions">
                  <button disabled={busyId === booking.id} onClick={() => onUpdate(booking.id, 'approved')} className="approve-button" aria-label="Duyệt yêu cầu">✓</button>
                  <button disabled={busyId === booking.id} onClick={() => onUpdate(booking.id, 'rejected')} className="reject-button" aria-label="Từ chối yêu cầu">×</button>
                </div>
              ) : <span className="muted">—</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
