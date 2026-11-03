import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <NavLink className="brand" to="/">
        <span className="brand-mark">L</span>
        <span>lab<span className="brand-light">mate</span><small>RESEARCH, MADE EASIER</small></span>
      </NavLink>
      <nav className="main-nav" aria-label="Điều hướng chính">
        <NavLink to="/">Phòng lab</NavLink>
        {user.role !== 'manager' && <NavLink to="/my-bookings">Đơn của tôi</NavLink>}
        {user.role === 'manager' && <NavLink to="/admin">Quản trị</NavLink>}
      </nav>
      <div className="user-menu">
        <span className="user-avatar">{user.name.split(' ').at(-1).slice(0, 1)}</span>
        <div className="user-copy"><strong>{user.name}</strong><span>{roleName[user.role]}</span></div>
        <button className="icon-button logout-button" onClick={logout} title="Đăng xuất" aria-label="Đăng xuất">↗</button>
      </div>
    </header>
  );
}

export const roleName = { student: 'Sinh viên', teacher: 'Giảng viên', manager: 'Lab Manager' };
