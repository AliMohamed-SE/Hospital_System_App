import { Schema, Types, model, models } from "mongoose";

export interface IAppointmentTypes {
  _id: Types.ObjectId;
  name: string;
}

const AppointmentTypeSchema = new Schema<IAppointmentTypes>(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
  },
  { timestamps: true }
);

const AppointmentType =
  models.AppointmentType || model("AppointmentType", AppointmentTypeSchema);

export default AppointmentType;
