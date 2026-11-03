export default function UsageChart({ rooms }) {
  return (
    <div className="usage-chart">
      {rooms.map((room, index) => (
        <div className="usage-row" key={room.id}>
          <div className="usage-label"><span><i className={`chart-dot dot-${index + 1}`} />{room.name}</span><strong>{room.utilization}%</strong></div>
          <div className="usage-track"><div className={`usage-fill fill-${index + 1}`} style={{ width: `${room.utilization}%` }} /></div>
          <small>{room.hours} giờ sử dụng trong tuần</small>
        </div>
      ))}
    </div>
  );
}
