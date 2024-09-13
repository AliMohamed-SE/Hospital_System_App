import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/user";
import clientPromise from "@/utils/database";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Function to create a session token (JWT)
const createSessionToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "30m" });
};

export async function POST(request: Request) {
  const { userId, passkey } = await request.json();

  try {
    // Ensure mongoose is connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!, {
        dbName: process.env.MONGODB_DATABASE,
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.otp_expire > new Date()) {
      const isValidOTP = await bcrypt.compare(passkey, user.otp);

      if (isValidOTP) {
        // OTP is valid, clear it from the database
        user.otp = null;
        user.otp_expire = null; // Make sure to nullify otp_expire
        await user.save();

        // Create session token (JWT)
        const sessionToken = createSessionToken(user._id);

        // Create the response and set the session token in a cookie
        const response = NextResponse.json(
          { message: "OTP verified" },
          { status: 200 }
        );

        // Set the session token in an HttpOnly cookie
        response.headers.set(
          "Set-Cookie",
          `sessionToken=${sessionToken}; HttpOnly; Path=/; Max-Age=1800; SameSite=Strict; Secure`
        ); // Cookie expires in 30 minutes

        return response;
      } else {
        return NextResponse.json({ error: "Wrong OTP" }, { status: 401 });
      }
    } else {
      return NextResponse.json(
        { error: "This OTP is expired, please generate a new one" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error during OTP verification:", error);
    return NextResponse.json(
      { error: "An error has occurred during OTP verification" },
      { status: 500 }
    );
  }
}
