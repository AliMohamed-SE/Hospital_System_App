import { Schema, model, models } from "mongoose";

const PatientSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    phone: {
      type: String,
      required: true,
      match: [/^\+[1-9]\d{1,14}$/, "Please provide a valid phone number"],
    },
    birthDate: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    occupation: {
      type: String,
      required: true,
    },
    emergencyContactName: {
      type: String,
      required: true,
    },
    emergencyContactNumber: {
      type: String,
      required: true,
      match: [/^\+[1-9]\d{1,14}$/, "Please provide a valid phone number"],
    },
    primaryPhysician: {
      type: String,
      required: true,
    },
    insuranceProvider: {
      type: String,
      required: true,
    },
    insurancePolicyNumber: {
      type: String,
      required: true,
    },
    allergies: {
      type: String,
    },
    currentMedication: {
      type: String,
    },
    familyMedicalHistory: {
      type: String,
    },
    pastMedicalHistory: {
      type: String,
    },
    identificationType: {
      type: String,
    },
    identificationNumber: {
      type: String,
    },
    identificationDocument: {
      type: String,
    },
    privacyConsent: {
      type: Boolean,
      required: true,
    },
    treatmentConsent: {
      type: Boolean,
      required: true,
    },
    disclosureConsent: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

// Create or retrieve the Patient model
const Patient = models.Patient || model("Patient", PatientSchema);

export default Patient;
