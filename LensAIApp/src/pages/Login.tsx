import { useEffect, useState, type FormEvent } from 'react'
import { useAuth } from 'react-oidc-context'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/common/Button'

export function Login() {
  const { isAuthenticated, isLoading, signinRedirect } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const nextPath = typeof location.state === 'object' && location.state && 'from' in location.state
        ? String((location.state as { from?: string }).from || '/dashboard')
        : '/dashboard'

      navigate(nextPath, { replace: true })
    }
  }, [isAuthenticated, isLoading, location.state, navigate])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await signinRedirect({
        state: {
          from: typeof location.state === 'object' && location.state && 'from' in location.state
            ? String((location.state as { from?: string }).from || '/dashboard')
            : '/dashboard',
        },
      })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Login failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-shell">
        <div className="login-brand">LensAI</div>
        <p className="login-tagline">Understand every image.</p>

        <form className="login-card" onSubmit={handleSubmit} noValidate>
          <p className="login-description">Sign in with your Cognito account to continue.</p>

          {error ? <p className="form-error">{error}</p> : null}

          <Button type="submit" fullWidth disabled={isSubmitting || isLoading}>
            {isSubmitting ? 'Redirecting...' : 'Sign In with Cognito'}
          </Button>
        </form>
      </div>
    </div>
  )
}
