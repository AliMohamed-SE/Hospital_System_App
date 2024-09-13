import { NextResponse } from "next/server";
import mongoose from "mongoose";
import clientPromise from "@/utils/database";
import Appointment from "@/models/appointment";
import AppointmentType from "@/models/AppointmentType";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const appointmentType = searchParams.get("appointmentType");
  const userId = searchParams.get("userId");
  const appointmentId = searchParams.get("appointmentId");

  try {
    // Ensure mongoose is connected
    if (mongoose.connection.readyState === 0) {
      await clientPromise; // Ensure the MongoDB client is connected
      await mongoose.connect(process.env.MONGODB_URI!, {
        dbName: process.env.MONGODB_DATABASE,
      });
    }

    let type;

    if (appointmentType) {
      type = await AppointmentType.findOne({ name: appointmentType });
    }

    const query: Record<string, any> = {};

    if (type && type._id) {
      query.appointmenttype = type._id;
    }

    if (userId) {
      query.userId = userId;
    }

    if (appointmentId) {
      query.appointmentId = appointmentId;
    }

    const appointments = await Appointment.find(query)
      .populate("patient")
      .exec();

    return NextResponse.json(
      {
        appointments: appointments,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve labs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const appointmentDetails = await request.json();
  try {
    // Ensure mongoose is connected
    if (mongoose.connection.readyState === 0) {
      await clientPromise; // Ensure the MongoDB client is connected
      await mongoose.connect(process.env.MONGODB_URI!, {
        dbName: process.env.MONGODB_DATABASE,
      });
    }
    const appointment = new Appointment(appointmentDetails);
    await appointment.save();

    if (appointment) {
      return NextResponse.json({ appointment: appointment }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "failed to create appointment" },
        { status: 404 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { appointmentId } = await request.json();
  try {
    // Ensure mongoose is connected
    if (mongoose.connection.readyState === 0) {
      await clientPromise; // Ensure the MongoDB client is connected
      await mongoose.connect(process.env.MONGODB_URI!, {
        dbName: process.env.MONGODB_DATABASE,
      });
    }
    const appointment = await Appointment.findById(appointmentId);
    appointment.status = "cancelled";
    await appointment.save();

    if (appointment) {
      return NextResponse.json({ status: 200 });
    } else {
      return NextResponse.json(
        { error: "failed to delete appointment" },
        { status: 404 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to delete appointment" },
      { status: 500 }
    );
  }
}
