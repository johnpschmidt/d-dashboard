// This is an example of how to read a JSON Web Token from an API route
import { getToken } from "next-auth/jwt"
import { unstable_getServerSession } from "next-auth"
import  {authOptions} from "../auth/[...nextauth]"

import type { NextApiRequest, NextApiResponse } from "next"


const secret = process.env.NEXTAUTH_SECRET;
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const userSession: any = await unstable_getServerSession(req, res, authOptions)
if(userSession.user.token){
    const test = await fetch('https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/',{
        headers:{
            'X-API-KEY': `${process.env.BUNGIE_API_KEY}`,
            'Authorization': `Bearer ${userSession.user.token}`
        }
        }).then((Response)=>{
            let profileData = Response.json(); 
            return profileData
        })
        console.log(test);

}
 




  res.send("hi")
}
