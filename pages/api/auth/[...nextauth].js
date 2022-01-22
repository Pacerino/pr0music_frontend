import NextAuth from "next-auth";

if (!process.env.AUTH_API || !process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
  throw new Error("Please add your AUTH_API, CLIENT_ID, CLIENT_SECRET to .env.local")
}

export default NextAuth({
  providers: [
    {
      id: "keycloak",
      name: "Keycloak",
      type: "oauth",
      wellKnown: `${process.env.AUTH_API}/.well-known/openid-configuration`,
      authorization: { params: { scope: "openid email profile roles" } },
      idToken: true,
      checks: ["pkce", "state"],
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name ?? profile.preferred_username,
          email: profile.email,
          image: profile.picture,
          roles: profile.resource_access.pr0sauce.roles
        }
      },
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    }
  ],
  callbacks: {
    jwt: async ({token, user, account}) => {
      if (account) {
        token.accessToken = account.access_token
      }
      if(user) {
        token.roles = user.roles
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.accessToken = token.accessToken
        session.roles = token.roles
      }
      return session;
    },
  },
  theme: {
    colorScheme: "dark",
  },
  secret: process.env.CLIENT_JWT_SECRET,
});
