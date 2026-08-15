import { UserManager, type User as OidcUser } from 'oidc-client-ts'
import type { User } from '../types'
import { cognitoAuthConfig } from '../config/auth'

const userManager = new UserManager({
  authority: cognitoAuthConfig.authority,
  client_id: cognitoAuthConfig.client_id,
  redirect_uri: cognitoAuthConfig.redirect_uri,
  response_type: cognitoAuthConfig.response_type,
  scope: cognitoAuthConfig.scope,
  post_logout_redirect_uri: cognitoAuthConfig.post_logout_redirect_uri,
  loadUserInfo: true,
  automaticSilentRenew: true,
})

const mapOidcUser = (oidcUser: OidcUser | null | undefined): User | null => {
  if (!oidcUser) {
    return null
  }

  const profile = oidcUser.profile ?? {}
  const email = typeof profile.email === 'string' ? profile.email : ''
  const name =
    typeof profile.name === 'string'
      ? profile.name
      : typeof profile.given_name === 'string'
        ? profile.given_name
        : 'User'

  return {
    id: String(profile.sub ?? 'cognito-user'),
    name,
    email,
  }
}

export const authService = {
  async login(_email?: string, _password?: string): Promise<void> {
    await userManager.signinRedirect()
  },

  async logout(): Promise<void> {
    await userManager.signoutRedirect()
  },

  async isAuthenticated(): Promise<boolean> {
    const oidcUser = await userManager.getUser()
    return Boolean(oidcUser && !oidcUser.expired)
  },

  async getCurrentUser(): Promise<User | null> {
    const oidcUser = await userManager.getUser()
    return mapOidcUser(oidcUser)
  },

  async handleSigninCallback(): Promise<User | null> {
    const oidcUser = await userManager.signinCallback()
    return mapOidcUser(oidcUser)
  },
}
