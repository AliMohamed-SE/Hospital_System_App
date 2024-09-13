import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Create a response object
  const response = NextResponse.json(
    { message: "Signed out successfully" },
    { status: 200 }
  );

  // Clear the session cookie by setting it with an empty value and immediate expiration
  response.headers.set(
    "Set-Cookie",
    `sessionToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict; Secure`
  );

  return response;
}
