import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak"
if (!process.env.AUTH_API || !process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
  throw new Error("Please add your AUTH_API, CLIENT_ID, CLIENT_SECRET to .env.local")
}

const refreshAccessToken = async (token) => {
  try {
    if (Date.now() > token.refreshTokenExpired) throw Error;
    const details = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: ['refresh_token'],
      refresh_token: token.refreshToken,
    };
    const formBody = [];
    Object.entries(details).forEach(([key, value]) => {
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(value);
      formBody.push(encodedKey + '=' + encodedValue);
    });
    const formData = formBody.join('&');
    const url = `${process.env.AUTH_API}/protocol/openid-connect/token`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: formData,
    });
    const refreshedTokens = await response.json();
    if (!response.ok) throw refreshedTokens;
    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpired: Date.now() + (refreshedTokens.expires_in - 15) * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refresh_token,
      refreshTokenExpired:
        Date.now() + (refreshedTokens.refresh_expires_in - 15) * 1000,
    };
  } catch (error) {
    console.log(error)
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
};

export default NextAuth({
  providers: [
    KeycloakProvider({
      issuer: process.env.AUTH_API,
      version: "2.0",
      params: { grant_type: 'authorization_code' },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name ?? profile.preferred_username,
          email: profile.email,
          image: profile.picture,
          roles: profile.realm_access.roles,
          ...profile
        }
      },
      authorizationParams: {
        response_type: 'code',
      },
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    })
  ],
  callbacks: {
    jwt: async ({token, user, account}) => { 
      // Initial sign in
      if (account && user) {
        console.log(account)
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token;
        token.accessTokenExpired = (account.expires_at - 15) * 1000;
        token.refreshTokenExpired = Date.now() + (account.refresh_expires_in - 15) * 1000;
        token.user = user
        return token
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpired) return token;

      return refreshAccessToken(token);
      
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user = token.user
        session.accessToken = token.accessToken
        session.error = token.error
      }
      return session
    },
  },
  theme: {
    colorScheme: "dark",
  },
  secret: process.env.CLIENT_JWT_SECRET,
});
