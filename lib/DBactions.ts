import mongoose from "mongoose";
import Appointment, { IAppointment } from "@/models/appointment";
import clientPromise from "@/utils/database";

export async function getAppointment(
  userId: string
): Promise<IAppointment | null> {
  if (mongoose.connection.readyState === 0) {
    // Ensure the MongoDB client is connected
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: process.env.MONGODB_DATABASE,
    });
  }

  // Find the appointments for the given userId and return as plain JS objects
  const appointment = await Appointment.findOne({
    userId,
  }).lean<IAppointment>();

  return appointment;
}
