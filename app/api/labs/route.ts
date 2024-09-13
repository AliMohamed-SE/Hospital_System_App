import { NextResponse } from "next/server";
import mongoose from "mongoose";
import clientPromise from "@/utils/database";
import Lab from "@/models/lab";

export async function GET(request: Request) {
  try {
    // Ensure mongoose is connected
    if (mongoose.connection.readyState === 0) {
      await clientPromise; // Ensure the MongoDB client is connected
      await mongoose.connect(process.env.MONGODB_URI!, {
        dbName: process.env.MONGODB_DATABASE,
      });
    }

    const labs = await Lab.find();

    if (labs) {
      return NextResponse.json(
        {
          list: labs,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          error: "No labs found",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve labs" },
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
    const lab = new Lab({ name, image: url });
    await lab.save();

    return NextResponse.json({ status: 200, labId: lab._id });
  } catch (error) {
    console.error("Error handling file upload:", error);
    return NextResponse.json(
      { error: "Failed to create lab" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const { labId, name, url } = await request.json();

  try {
    // Ensure mongoose is connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!, {
        dbName: process.env.MONGODB_DATABASE,
      });
    }

    // Create a new doctor
    const lab = await Lab.findById(labId);

    lab.name = name || lab.name;
    lab.image = url || lab.image;

    await lab.save();

    return NextResponse.json({ status: 200 });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      { error: "Failed to update lab" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { labId } = await request.json();

  try {
    // Ensure mongoose is connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!, {
        dbName: process.env.MONGODB_DATABASE,
      });
    }

    await Lab.findByIdAndDelete(labId);

    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to remove lab" },
      { status: 500 }
    );
  }
}
