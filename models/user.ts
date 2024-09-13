import { Schema, model, models, Document } from "mongoose";

// Define the User interface
interface IUser extends Document {
  phone: string;
  otp: string;
  otp_expire: Date;
}

// Define the User Schema
const UserSchema = new Schema<IUser>(
  {
    phone: {
      type: String,
      unique: true,
      required: [true, "Phone number is required"],
      match: [/^\+[1-9]\d{1,14}$/, "Please provide a valid phone number"],
    },
    otp: {
      type: String,
      length: [6, "Password must be 6 characters long"],
    },
    otp_expire: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Create or retrieve the User model
const User = models.User || model<IUser>("User", UserSchema);

export default User;
