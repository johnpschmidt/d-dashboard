// This is an example of how to read a JSON Web Token from an API route
import { getToken } from "next-auth/jwt"
import { unstable_getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"

import type { NextApiRequest, NextApiResponse } from "next"
import { profile } from "console";
import { ProfilerProps } from "react";



const secret = process.env.NEXTAUTH_SECRET;

interface DestinyCharacterData{
  Response:{
    characters:{
      data: object | void | null
    }
  },
  DestinyMembershipID: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userSession: any = await unstable_getServerSession(req, res, authOptions)

  const apiAuthOptions = {
    headers: {
      'X-API-KEY': `${process.env.BUNGIE_API_KEY}`,
      'Authorization': `Bearer ${userSession.user.token}`
    }
  }
  const options = {
    headers: {
      'X-API-KEY': `${process.env.BUNGIE_API_KEY}`
    }
  }
  if (userSession.user.token) {
    //make an authenticated request to bungie to grab current logged in user, grab the platform ID and grab character data from the bungie API

    const CurrentUser = await fetch('https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/', apiAuthOptions).then((Response) => {let profileData = Response.json();return profileData})

    const membershipID:DestinyCharacterData = CurrentUser.Response.primaryMembershipId

    let DestinyCharacterData:DestinyCharacterData = await fetch(`https://www.bungie.net/Platform/Destiny2/2/Profile/${membershipID}?components=200`, options).then((response) => {return response.json()})

    res.send(DestinyCharacterData.Response.characters.data)
  }else{
    res.send('User is not logged in');
  }
}
