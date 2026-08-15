import { useAuth } from 'react-oidc-context'
import { useNavigate } from 'react-router-dom'

export function Header() {
  const navigate = useNavigate()
  const { user, signoutRedirect } = useAuth()

  const handleSignOut = async () => {
    await signoutRedirect()
    navigate('/login', { replace: true })
  }

  return (
    <header className="topbar">
      <div>
        <p className="topbar-label">Overview</p>
      </div>
      <div className="user-menu" aria-label="User menu">
        <span>{user?.profile?.name || user?.profile?.email || 'User'}</span>
        <button type="button" className="menu-trigger" onClick={handleSignOut}>
          Sign out
        </button>
      </div>
    </header>
  )
}
