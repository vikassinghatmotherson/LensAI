export const cognitoAuthConfig = {
  authority:
    "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_P7y7arOJ4",
  client_id: "246mqk6gjnte1omttoe54oph6t",
  redirect_uri: "https://lens-ai-six.vercel.app/callback",
  response_type: "code",
  scope: "email openid phone",
  post_logout_redirect_uri: "https://lens-ai-six.vercel.app/login",
  cognitoDomain: "https://ap-south-1p7y7aroj4.auth.ap-south-1.amazoncognito.com",
};
