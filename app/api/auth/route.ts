import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/user";
import clientPromise from "@/utils/database";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  const { phone } = await request.json();

  if (!phone) {
    return NextResponse.json({ error: "Phone is required" }, { status: 400 });
  }

  try {
    // Ensure mongoose is connected
    if (mongoose.connection.readyState === 0) {
      await clientPromise; // Ensure the MongoDB client is connected
      await mongoose.connect(process.env.MONGODB_URI!, {
        dbName: process.env.MONGODB_DATABASE,
      });
    }

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + 5);
    console.log(otp);

    // Hashing the otp
    const saltRounds = 10;
    const hashedOtp = await bcrypt.hash(otp, saltRounds);

    // Check if the user already exists in the database
    const user = await User.findOne({ phone: phone });

    if (user) {
      user.otp = hashedOtp;
      user.otp_expire = expirationDate;

      await user.save();

      return NextResponse.json(
        {
          message: "User updated",
          userId: user._id,
        },
        { status: 200 }
      );
    } else {
      const user = new User({ phone, hashedOtp, expirationDate });
      await user.save();

      return NextResponse.json(
        {
          message: "User created",
          userId: user._id,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "An Error has occurred, please try again later" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  try {
    // Ensure mongoose is connected
    if (mongoose.connection.readyState === 0) {
      await clientPromise; // Ensure the MongoDB client is connected
      await mongoose.connect(process.env.MONGODB_URI!, {
        dbName: process.env.MONGODB_DATABASE,
      });
    }

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + 5);
    console.log(otp);

    // Hashing the otp
    const saltRounds = 10;
    const hashedOtp = await bcrypt.hash(otp, saltRounds);

    // Check if the user already exists in the database
    const user = await User.findById(userId);

    if (user) {
      user.otp = hashedOtp;
      user.otp_expire = expirationDate;

      await user.save();

      return NextResponse.json(
        {
          message: "User updated",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          error: "User not found",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "An Error has occurred, please try again later" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const { phone, otp, otp_expire } = await request.json();

  try {
    if (mongoose.connection.readyState === 0) {
      await clientPromise;
      await mongoose.connect(process.env.MONGODB_URI!, {
        dbName: process.env.MONGODB_DATABASE,
      });
    }

    const user = await User.findOne({ phone: phone });

    if (user) {
      user.otp = otp;
      user.otp_expire = otp_expire;

      await user.save();

      return NextResponse.json(
        {
          message: "User updated",
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
