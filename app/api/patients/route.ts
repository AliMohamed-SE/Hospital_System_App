import { NextResponse } from "next/server";
import mongoose from "mongoose";
import clientPromise from "@/utils/database";
import Patient from "@/models/patient";

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

    const query: Record<string, any> = {};

    if (userId) {
      query.userId = userId;
    }

    const patient = await Patient.find(query);

    if (patient) {
      return NextResponse.json(
        {
          result: patient,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          error: "No Patient found",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve patients" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const patientData = await request.json();

  try {
    // Ensure mongoose is connected
    if (mongoose.connection.readyState === 0) {
      await clientPromise; // Ensure the MongoDB client is connected
      await mongoose.connect(process.env.MONGODB_URI!, {
        dbName: process.env.MONGODB_DATABASE,
      });
    }

    const patient = new Patient(patientData);
    await patient.save();

    if (patient) {
      return NextResponse.json({ status: 200 });
    } else {
      return NextResponse.json({ status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to create patient" },
      { status: 500 }
    );
  }
}
