import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from './../../../lib/mongodb'

 

// const adminEmails = ['marzieh_abidi@yahoo.com'];

export const authOptions= {
    // secret: process.env.SECRET,
  
    
  
    providers: [
      // GoogleProvider({
      //   clientId: process.env.GOOGLE_ID,
      //   clientSecret: process.env.GOOGLE_SECRET
      // })
      GitHubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET
      })
    ],
    secret: "PLACE-HERE-ANY-STRING",
     adapter: MongoDBAdapter(clientPromise),
  
    //  callbacks: {
    //   session: ({session,token,user}) => {
      
    //     if (adminEmails.includes(session?.user?.email)) {
    //       // console.log(session,token,email)
    //       return session;
    //     } else {
    //       return false;
    //     }
    //   },
    // },
    
  
  
  }



export default NextAuth(authOptions)

export async function IsAdminRequest(res,req){
  const session=await getServerSession(res,req,authOptions)
  if(!adminEmails.includes(session?.user?.email)){
    throw 'not an admin';

  }

}