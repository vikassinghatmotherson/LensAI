import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: '◫' },
  { label: 'My Images', path: '/images', icon: '▣' },
  { label: 'Analysis History', path: '/history', icon: '◌' },
  { label: 'Settings', path: '/settings', icon: '⚙' },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">L</div>
        <span>LensAI</span>
      </div>

      <nav className="sidebar-nav" aria-label="Sidebar navigation">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="profile-block">
          <div className="profile-avatar">U</div>
          <div>
            <strong>User</strong>
            <small>Profile</small>
          </div>
        </div>

        <Link to="/login" className="signout-link">
          Sign out
        </Link>
      </div>
    </aside>
  )
}
