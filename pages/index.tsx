import Layout from "../components/layout"
import { getSession } from "next-auth/react"
import { getToken } from "next-auth/jwt"

export default function IndexPage() {
  // fetch('https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/')

  return (
    <Layout>
      hi
    </Layout>
  )
}
