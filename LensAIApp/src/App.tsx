import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from 'react-oidc-context'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Images } from './pages/Images'
import { History } from './pages/History'
import { Settings } from './pages/Settings'
import { ProtectedRoute } from './routes/ProtectedRoute'

function App() {
  const { isAuthenticated, isLoading, error, removeUser, signinRedirect, user } = useAuth()

  const handleSignOut = () => {
    const cognitoDomain = 'https://ap-south-1ffahulca8.auth.ap-south-1.amazoncognito.com'
    const clientId = '20oenqg86re4v0i6eib2kg22su'
    const logoutUri = 'https://lens-ai-six.vercel.app/'

    removeUser()
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`
  }

  if (isLoading) {
    return <div className="page-loading">Loading...</div>
  }

  if (error) {
    return <div className="page-loading">Encountering error... {error.message}</div>
  }

  if (isAuthenticated) {
    return (
      <div>
        <pre>Hello: {user?.profile?.email}</pre>
        <pre>ID Token: {user?.id_token}</pre>
        <pre>Access Token: {user?.access_token}</pre>
        <pre>Refresh Token: {user?.refresh_token}</pre>
        <button type="button" onClick={() => signinRedirect()}>
          Sign in
        </button>
        <button type="button" onClick={handleSignOut}>
          Sign out
        </button>
      </div>
    )
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/images"
        element={
          <ProtectedRoute>
            <Images />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
      />
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
      />
    </Routes>
  )
}

export default App
