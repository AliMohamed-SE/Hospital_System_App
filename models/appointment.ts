import { Patient } from "@/types/appwrite.types";
import { Schema, Types, model, models } from "mongoose";

export interface IAppointment {
  _id: Types.ObjectId;
  patient: Patient;
  schedule: Date;
  status: Status;
  appointmenttype: Type;
  primaryPhysician: string;
  reason: string;
  note: string;
  userId: string;
  cancellationReason: string | null;
}

const AppointmentSchema = new Schema(
  {
    patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true }, // Assuming patient references another collection
    schedule: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      required: true,
    }, // Enum for status
    appointmenttype: {
      type: Schema.Types.ObjectId,
      ref: "AppointmentType",
      required: true,
    }, // Define types as needed
    primaryPhysician: { type: String, required: true },
    reason: { type: String, required: true },
    note: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Assuming user references another collection
    cancellationReason: { type: String, default: null },
  },
  { timestamps: true }
);

// Create or retrieve the Appointment model
const Appointment =
  models.Appointment || model("Appointment", AppointmentSchema);

export default Appointment;
