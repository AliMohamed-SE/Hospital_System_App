import { NextResponse } from "next/server";
import mongoose from "mongoose";
import clientPromise from "@/utils/database";
import Radiology from "@/models/radiology";

export async function GET(request: Request) {
  try {
    // Ensure mongoose is connected
    if (mongoose.connection.readyState === 0) {
      await clientPromise; // Ensure the MongoDB client is connected
      await mongoose.connect(process.env.MONGODB_URI!, {
        dbName: process.env.MONGODB_DATABASE,
      });
    }

    const radiologies = await Radiology.find();

    if (radiologies) {
      return NextResponse.json(
        {
          list: radiologies,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          error: "No radiologies found",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve radiologies" },
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
    const radiology = new Radiology({ name, image: url });
    await radiology.save();

    return NextResponse.json({ status: 200, radiologyId: radiology._id });
  } catch (error) {
    console.error("Error handling file upload:", error);
    return NextResponse.json(
      { error: "Failed to create radiology" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const { radiologyId, name, url } = await request.json();

  try {
    // Ensure mongoose is connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!, {
        dbName: process.env.MONGODB_DATABASE,
      });
    }

    // Create a new doctor
    const radiology = await Radiology.findById(radiologyId);

    radiology.name = name || radiology.name;
    radiology.image = url || radiology.image;

    await radiology.save();

    return NextResponse.json({ status: 200 });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      { error: "Failed to update radiology" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { radiologyId } = await request.json();

  try {
    // Ensure mongoose is connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!, {
        dbName: process.env.MONGODB_DATABASE,
      });
    }

    await Radiology.findByIdAndDelete(radiologyId);

    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to remove radiology" },
      { status: 500 }
    );
  }
}
