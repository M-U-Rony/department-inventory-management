import { NextResponse,NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req:NextRequest) {

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }
  
  return NextResponse.next();
}

//api routes
/* 
/api/additem
/api/assignItem
api/createRoom
api/deleteitem
api/getUnassignedItems
api/updateitem
api/updateRoomName

*/

export const config = {
  matcher: [
    "/((?!api/auth|signin|_next/static|_next/image|favicon.ico).*)",
  ],
};
