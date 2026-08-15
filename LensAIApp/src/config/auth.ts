export const cognitoAuthConfig = {
  authority: 'https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_fFaHULCA8',
  client_id: '20oenqg86re4v0i6eib2kg22su',
  redirect_uri: 'https://lens-ai-six.vercel.app/',
  response_type: 'code',
  scope: 'email openid phone',
  post_logout_redirect_uri:
    import.meta.env.VITE_COGNITO_LOGOUT_REDIRECT_URI ?? 'https://lens-ai-six.vercel.app/',
}
