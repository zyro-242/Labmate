import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roles = [
  { id: 'student', title: 'Sinh viên', description: 'Tìm và đặt phòng phục vụ nghiên cứu', icon: '♙', account: 'sv01@labmate.vn' },
  { id: 'teacher', title: 'Giảng viên', description: 'Tổ chức lớp học và hướng dẫn nghiên cứu', icon: '⌑', account: 'gv01@labmate.vn' },
  { id: 'manager', title: 'Lab Manager', description: 'Duyệt yêu cầu và theo dõi hiệu suất', icon: '▦', account: 'ql01@labmate.vn' }
];

export default function LoginPage() {
  const { user, login } = useAuth();
  const [selected, setSelected] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  if (user) return <Navigate to="/" replace />;

  async function submit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(selected);
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-showcase">
        <a className="brand login-brand" href="/"><span className="brand-mark">L</span><span>lab<span className="brand-light">mate</span><small>RESEARCH, MADE EASIER</small></span></a>
        <div className="showcase-content">
          <span className="eyebrow eyebrow-light">NỀN TẢNG QUẢN LÝ PHÒNG THÍ NGHIỆM</span>
          <h1>Không gian tốt.<br /><span>Ý tưởng lớn.</span></h1>
          <p>Kết nối nhà nghiên cứu với phòng lab phù hợp — đặt lịch dễ dàng, cộng tác hiệu quả.</p>
          <div className="showcase-stat"><div className="stat-avatars"><span>A</span><span>N</span><span>H</span></div><div><strong>5 phòng lab chuyên biệt</strong><small>Sẵn sàng cho ý tưởng tiếp theo của bạn</small></div></div>
        </div>
        <div className="showcase-footer"><span>© 2026 LabMate</span><span>BUILT FOR INNOVATION</span></div>
      </section>
      <section className="login-form-side">
        <form className="login-card" onSubmit={submit}>
          <span className="eyebrow">CHÀO MỪNG ĐẾN VỚI LABMATE</span>
          <h2>Bắt đầu khám phá</h2>
          <p className="login-intro">Chọn vai trò để trải nghiệm bản demo.</p>
          <div className="role-list">
            {roles.map((role) => (
              <button type="button" onClick={() => setSelected(role.id)} key={role.id} className={`role-option ${selected === role.id ? 'role-selected' : ''}`}>
                <span className="role-icon">{role.icon}</span><span className="role-copy"><strong>{role.title}</strong><small>{role.description}</small></span><span className="role-radio">{selected === role.id ? '●' : '○'}</span>
              </button>
            ))}
          </div>
          <div className="demo-account"><span>TÀI KHOẢN DEMO</span><strong>{roles.find((role) => role.id === selected).account}</strong></div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-primary login-submit" disabled={loading}>{loading ? 'Đang đăng nhập…' : 'Đăng nhập trải nghiệm'} <span>→</span></button>
          <p className="demo-caption">Không cần mật khẩu · Dữ liệu demo có sẵn</p>
        </form>
      </section>
    </main>
  );
}
