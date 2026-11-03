import { useEffect, useState } from 'react';

export default function BookingModal({ room, date, onClose, onSubmit }) {
  const [form, setForm] = useState({ startTime: '09:00', endTime: '11:00', purpose: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      await onSubmit(form);
    } catch (submissionError) {
      setError(submissionError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-heading">
          <div><span className="eyebrow">YÊU CẦU ĐẶT PHÒNG</span><h2 id="modal-title">{room.name}</h2><p>{room.building}</p></div>
          <button className="icon-button close-button" onClick={onClose} aria-label="Đóng">×</button>
        </div>
        <form onSubmit={submit}>
          <label>Ngày sử dụng<input type="date" value={date} readOnly /></label>
          <div className="form-row">
            <label>Giờ bắt đầu<input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} required /></label>
            <label>Giờ kết thúc<input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} required /></label>
          </div>
          <label>Mục đích sử dụng<textarea value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} placeholder="Mô tả ngắn gọn hoạt động nghiên cứu / thực hành..." required rows="3" maxLength="240" /></label>
          <div className="approval-note"><span>ⓘ</span> Yêu cầu sẽ được gửi đến Lab Manager để xét duyệt.</div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="modal-actions"><button type="button" className="button button-quiet" onClick={onClose}>Hủy</button><button className="button button-primary" disabled={saving}>{saving ? 'Đang gửi…' : 'Gửi yêu cầu'}</button></div>
        </form>
      </section>
    </div>
  );
}
