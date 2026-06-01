import { NextResponse } from "next/server"

export async function GET(request) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url))
  response.cookies.set("kraftana_admin_session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  })
  return response
}
