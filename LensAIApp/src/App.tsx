import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from 'react-oidc-context'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Images } from './pages/Images'
import { History } from './pages/History'
import { Settings } from './pages/Settings'
import { ProtectedRoute } from './routes/ProtectedRoute'

function App() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <div className="page-loading">Loading...</div>
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
