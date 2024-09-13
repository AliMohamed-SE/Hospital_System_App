import { NextResponse } from "next/server";
import mongoose from "mongoose";
import clientPromise from "@/utils/database";
import Doctor from "@/models/doctor";

export async function GET(request: Request) {
  try {
    // Ensure mongoose is connected
    if (mongoose.connection.readyState === 0) {
      await clientPromise; // Ensure the MongoDB client is connected
      await mongoose.connect(process.env.MONGODB_URI!, {
        dbName: process.env.MONGODB_DATABASE,
      });
    }

    const doctors = await Doctor.find();

    if (doctors) {
      return NextResponse.json(
        {
          list: doctors,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          error: "No doctors found",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve doctors" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { name, url } = await request.json();

  try {
    // Ensure mongoose is connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!, {
        dbName: process.env.MONGODB_DATABASE,
      });
    }

    // Create a new doctor
    const doctor = new Doctor({ name, image: url });
    await doctor.save();

    return NextResponse.json({ status: 200, doctorId: doctor._id });
  } catch (error) {
    console.error("Error handling file upload:", error);
    return NextResponse.json(
      { error: "Failed to create doctor" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const { doctorId, name, url } = await request.json();

  try {
    // Ensure mongoose is connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!, {
        dbName: process.env.MONGODB_DATABASE,
      });
    }

    // Create a new doctor
    const doctor = await Doctor.findById(doctorId);

    doctor.name = name || doctor.name;
    doctor.image = url || doctor.image;

    await doctor.save();

    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update doctor" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { doctorId } = await request.json();

  try {
    // Ensure mongoose is connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!, {
        dbName: process.env.MONGODB_DATABASE,
      });
    }

    await Doctor.findByIdAndDelete(doctorId);

    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to remove doctor" },
      { status: 500 }
    );
  }
}
