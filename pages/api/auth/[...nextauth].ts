import NextAuth, {NextAuthOptions} from 'next-auth'
import BungieProvider from "next-auth/providers/bungie";

export const authOptions: NextAuthOptions= {

  session:{strategy: 'jwt'},
  providers: [
    // OAuth authentication providers...
    BungieProvider({
        clientId: `${process.env.BUNGIE_CLIENT_ID}`,
        clientSecret: `${process.env.BUNGIE_CLIENT_SECRET}`,
        headers: {
          "X-API-Key": `${process.env.BUNGIE_API_KEY}`
        },
        authorization:{params:{"scope":""}}, 
        httpOptions:{headers:{'X-API-KEY':`${process.env.BUNGIE_API_KEY}`}}
      })
  ],
  callbacks:{
    async session({session, token, user}){
      if(session.user){
        session.user.token = token.accessToken; 
        session.user.memId = token.membershipId; 
      }
      console.log(token)
return (session)
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if(account){
        token.accessToken = account.access_token;
        token.membershipId= account.membership_id;
      }
      return token
    }
  }
}

export default NextAuth(authOptions);