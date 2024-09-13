import { Schema, model, models, Document } from "mongoose";

export interface IDoctor extends Document {
  name: string;
  image: string;
}

const DoctorSchema = new Schema<IDoctor>(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    image: {
      type: String,
      required: [true, "image is required"],
    },
  },
  { timestamps: true }
);

const Doctor = models.Doctor || model<IDoctor>("Doctor", DoctorSchema);

export default Doctor;
