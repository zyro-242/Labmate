function isValidTimeRange(startTime, endTime) {
  const isValidTime = (time) => {
    if (!/^\d{2}:\d{2}$/.test(time)) return false;
    const [hour, minute] = time.split(':').map(Number);
    return hour <= 23 && minute <= 59;
  };

  return isValidTime(startTime)
    && isValidTime(endTime)
    && startTime >= '08:00'
    && endTime <= '18:00'
    && startTime < endTime;
}

function hasTimeConflict(startTime, endTime, bookings) {
  return bookings.some((booking) => startTime < booking.end_time && endTime > booking.start_time);
}

module.exports = { hasTimeConflict, isValidTimeRange };
