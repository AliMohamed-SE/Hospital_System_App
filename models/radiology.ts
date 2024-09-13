import { Schema, model, models, Document } from "mongoose";

interface IRadiology extends Document {
  name: string;
  image: string;
}

const RadiologySchema = new Schema<IRadiology>(
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

const Radiology =
  models.Radiology || model<IRadiology>("Radiology", RadiologySchema);

export default Radiology;
