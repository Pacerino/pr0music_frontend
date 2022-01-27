import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak"
if (!process.env.AUTH_API || !process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
  throw new Error("Please add your AUTH_API, CLIENT_ID, CLIENT_SECRET to .env.local")
}

async function refreshAccessToken(token) {
  try {
    console.log("REQUEST")
    const url = process.env.AUTH_API + "/protocol/openid-connect/token"
    const data = new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: token.refreshToken,
    })
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: data
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }
    
    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpiresAt: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    }
  } catch (error) {
    console.log(error)

    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

export default NextAuth({
  providers: [
    KeycloakProvider({
      issuer: process.env.AUTH_API,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name ?? profile.preferred_username,
          email: profile.email,
          image: profile.picture,
          roles: profile.realm_access.roles
        }
      },
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    })
  ],
  callbacks: {
    jwt: async ({token, user, account}) => { 
      // Initial sign in
      if (account && user) {
        console.log(account.expires_at)
        token.accessToken = account.access_token
        token.accessTokenExpiresAt = (account.expires_at * 1000)
        token.refreshToken = account.refresh_token
        token.user = user
        return token
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpiresAt) {
        console.log(token.accessTokenExpiresAt)
        return token
      } else {
        return refreshAccessToken(token)
      }
      
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
