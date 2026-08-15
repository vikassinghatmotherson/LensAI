import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from 'react-oidc-context'
import './index.css'
import App from './App.tsx'
import { cognitoAuthConfig } from './config/auth'

const oidcConfig = {
  authority: cognitoAuthConfig.authority,
  client_id: cognitoAuthConfig.client_id,
  redirect_uri: cognitoAuthConfig.redirect_uri,
  response_type: cognitoAuthConfig.response_type,
  scope: cognitoAuthConfig.scope,
  post_logout_redirect_uri: cognitoAuthConfig.post_logout_redirect_uri,
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider {...oidcConfig}>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
