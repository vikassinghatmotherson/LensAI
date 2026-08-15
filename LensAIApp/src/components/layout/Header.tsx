import { authService } from '../../services/authService'
import { useNavigate } from 'react-router-dom'

export function Header() {
  const navigate = useNavigate()
  const user = authService.getCurrentUser()

  const handleSignOut = () => {
    authService.logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="topbar">
      <div>
        <p className="topbar-label">Overview</p>
      </div>
      <div className="user-menu" aria-label="User menu">
        <span>{user?.name || 'User'}</span>
        <button type="button" className="menu-trigger" onClick={handleSignOut}>
          Sign out
        </button>
      </div>
    </header>
  )
}
