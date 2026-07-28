import {auth as proxy} from "@/config/auth"
import { NextResponse } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export default proxy(async(req)=>{
  const isloggedIn = !!req.auth;
  const {pathname} = req.nextUrl;

  if(!isloggedIn && pathname.startsWith("/admin")){
      return NextResponse.redirect(new URL("/login",req.url))
  }
  if(isloggedIn && pathname === "/login"){
    return NextResponse.redirect(new URL("/admin",req.url))
  }
  return NextResponse.next()
})
 
export const config = {
  matcher: ["/admin/:path*","/login"],
}