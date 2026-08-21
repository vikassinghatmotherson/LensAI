import { useAuth } from 'react-oidc-context'
import { useNavigate } from 'react-router-dom'
import { authService } from '../../services/authService'

export function Header() {
  const navigate = useNavigate()
  const { user, removeUser } = useAuth()

  const handleSignOut = async () => {
    try {
      // Clear stored tokens
      authService.clearTokens()

      // Remove OIDC user from session storage
      removeUser()

      console.log('✓ User signed out successfully')
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      // Always redirect to login
      navigate('/login', { replace: true })
    }
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
