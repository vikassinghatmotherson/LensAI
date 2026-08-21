import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from 'react-oidc-context'

export function Callback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isAuthenticated, isLoading, user } = useAuth()

  useEffect(() => {
    // Extract code and state from URL
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (code && state) {
      console.log('✓ Authorization Code:', code)
      console.log('✓ State:', state)
    }

    if (isLoading) {
      return
    }

    if (isAuthenticated && user) {
      // Store tokens in localStorage
      if (user.access_token) {
        localStorage.setItem('access_token', user.access_token)
        console.log('✓ Access Token stored')
      }

      if (user.id_token) {
        localStorage.setItem('id_token', user.id_token)
        console.log('✓ ID Token stored')
      }

      if (user.refresh_token) {
        localStorage.setItem('refresh_token', user.refresh_token)
        console.log('✓ Refresh Token stored')
      }

      // Log user info
      console.log('✓ User authenticated:', {
        email: user.profile?.email,
        name: user.profile?.name,
        sub: user.profile?.sub,
      })

      // Redirect to dashboard
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, isLoading, user, navigate, searchParams])

  return <div className="page-loading">Authenticating...</div>
}
