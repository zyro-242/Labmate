const test = require('node:test');
const assert = require('node:assert/strict');
const { hasTimeConflict, isValidTimeRange } = require('./timeConflict');

test('allows back-to-back bookings and rejects overlapping intervals', () => {
  const booked = [{ start_time: '09:00', end_time: '10:00' }];
  assert.equal(hasTimeConflict('10:00', '11:00', booked), false);
  assert.equal(hasTimeConflict('09:30', '10:30', booked), true);
  assert.equal(hasTimeConflict('08:00', '09:00', booked), false);
});

test('validates ordered booking times within lab opening hours', () => {
  assert.equal(isValidTimeRange('08:00', '18:00'), true);
  assert.equal(isValidTimeRange('09:00', '09:00'), false);
  assert.equal(isValidTimeRange('07:59', '09:00'), false);
  assert.equal(isValidTimeRange('17:00', '18:01'), false);
  assert.equal(isValidTimeRange('13:60', '14:00'), false);
  assert.equal(isValidTimeRange('not-a-time', '14:00'), false);
});
