const roomIcons = ['✳', '⌁', '⌘', '▤', '⚗'];

export default function RoomGrid({ rooms, onBook }) {
  if (!rooms.length) return <div className="empty-state">Chưa có phòng lab nào.</div>;

  return (
    <div className="room-grid">
      {rooms.map((room, index) => {
        const booked = room.bookings.length > 0;
        const pending = room.pendingCount > 0;
        return (
          <article className="room-card" key={room.id}>
            <div className={`room-icon room-icon-${index + 1}`}>{roomIcons[index]}</div>
            <div className="room-card-heading">
              <span className={`availability ${booked || pending ? 'availability-busy' : ''}`}>
                <i />{booked ? `${room.bookings.length} lịch đã duyệt${pending ? ` · ${room.pendingCount} chờ duyệt` : ''}` : pending ? `${room.pendingCount} yêu cầu chờ duyệt` : 'Còn trống'}
              </span>
              <h3>{room.name}</h3>
              <p>{room.building}</p>
            </div>
            <div className="room-facts">
              <span><b>♙</b> {room.capacity} chỗ</span>
              <span className="equipment" title={room.equipment}><b>✧</b> {room.equipment}</span>
            </div>
            {room.bookings.length > 0 && (
              <div className="room-schedule">
                {room.bookings.slice(0, 2).map((booking) => (
                  <div key={booking.id}><time>{booking.start_time}–{booking.end_time}</time><span>{booking.purpose}</span></div>
                ))}
              </div>
            )}
            <button className="button button-outline room-book" onClick={() => onBook(room)}>
              Đặt phòng <span>→</span>
            </button>
          </article>
        );
      })}
    </div>
  );
}
