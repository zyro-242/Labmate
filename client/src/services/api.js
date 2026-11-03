async function request(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Không thể kết nối máy chủ.');
  return data;
}

export const api = {
  login: (role) => request('/auth/login', { method: 'POST', body: JSON.stringify({ role }) }),
  rooms: (date) => request(`/rooms?date=${encodeURIComponent(date)}`),
  bookings: (userId) => request(userId ? `/bookings?userId=${userId}` : '/bookings'),
  createBooking: (payload) => request('/bookings', { method: 'POST', body: JSON.stringify(payload) }),
  updateBooking: (id, status) => request(`/bookings/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),
  stats: () => request('/stats')
};
