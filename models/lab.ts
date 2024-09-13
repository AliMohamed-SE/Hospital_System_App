import { Schema, model, models, Document } from "mongoose";

interface ILab extends Document {
  name: string;
  image: string;
}

const LabSchema = new Schema<ILab>(
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

const Lab = models.Lab || model<ILab>("Lab", LabSchema);

export default Lab;
