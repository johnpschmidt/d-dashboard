import NextAuth, { NextAuthOptions } from "next-auth";
import BungieProvider from "next-auth/providers/bungie";

async function refreshAccessToken(token) {
  try {
    const url =
      "https://www.bungie.net/platform/app/oauth/token/" +
      new URLSearchParams({
        clientId: `${process.env.BUNGIE_CLIENT_ID}`,
        clientSecret: `${process.env.BUNGIE_CLIENT_SECRET}`,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      });

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-API-KEY": `${process.env.BUNGIE_API_KEY}`,
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_at * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    // OAuth authentication providers...
    BungieProvider({
      clientId: `${process.env.BUNGIE_CLIENT_ID}`,
      clientSecret: `${process.env.BUNGIE_CLIENT_SECRET}`,
      headers: {
        "X-API-Key": `${process.env.BUNGIE_API_KEY}`,
      },
      authorization: { params: { scope: "" } },
      httpOptions: {
        headers: { "X-API-KEY": `${process.env.BUNGIE_API_KEY}` },
      },
      userinfo: "https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/",
    })
  ],
  callbacks: {
    async session({ session, token, user }) {
      if (session.user) {
        session.user.token = token.accessToken;
        session.user.memId = token.membershipId;
        session.user.error = token.error
      }
      console.log(token);
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (account && account.expires_at) {
        token.accessToken = account.access_token;
        token.membershipId = account.membership_id;
        token.expiresAt = Date.now() + account.expires_at * 1000;
        token.refreshToken = account.refresh_token;
      }
      if (token.expiresAt) {
        if (Date.now() < token.expiresAt) {
          return token;
        }
        return refreshAccessToken(token);
      }

    },
  },
};

export default NextAuth(authOptions);
