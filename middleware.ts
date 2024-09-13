import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose"; // Import jwtVerify from jose

export async function middleware(req: NextRequest) {
  const sessionToken = req.cookies.get("sessionToken")?.value;

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    // Verify the token using Web Crypto API compatible library (jose)
    const { payload } = await jwtVerify(
      sessionToken,
      new TextEncoder().encode(process.env.JWT_SECRET as string) // Encode the secret
    );

    // Attach the decoded token data (e.g., userId) to the request headers
    req.headers.set("userId", payload.userId as string);

    // Continue to the next middleware or route
    return NextResponse.next();
  } catch (error: any) {
    console.error("JWT verification error:", error);

    const message =
      error.code === "ERR_JWT_EXPIRED" ? "Token expired" : "Invalid token";

    return NextResponse.redirect(new URL("/", req.url));
  }
}

// Middleware configuration
export const config = {
  matcher: ["/patients/:path*"],
};
