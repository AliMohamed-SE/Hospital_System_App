import { NextResponse } from "next/server";
import mongoose from "mongoose";
import clientPromise from "@/utils/database";
import AppointmentType from "@/models/AppointmentType";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const appointmentTypeId = searchParams.get("appointmentTypeId");

  try {
    // Ensure mongoose is connected
    if (mongoose.connection.readyState === 0) {
      await clientPromise; // Ensure the MongoDB client is connected
      await mongoose.connect(process.env.MONGODB_URI!, {
        dbName: process.env.MONGODB_DATABASE,
      });
    }

    const query: Record<string, any> = {};

    if (appointmentTypeId) {
      query._id = appointmentTypeId;
    }

    const types = await AppointmentType.find(query);

    if (types) {
      return NextResponse.json(
        {
          types: types,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          error: "No appointment types found",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve appointment types" },
      { status: 500 }
    );
  }
}

// export async function POST(request: Request) {
//   try {
//     // Ensure mongoose is connected
//     if (mongoose.connection.readyState === 0) {
//       await clientPromise; // Ensure the MongoDB client is connected
//       await mongoose.connect(process.env.MONGODB_URI!, {
//         dbName: process.env.MONGODB_DATABASE,
//       });
//     }

//     const types1 = new AppointmentType({ name: "Doctor Appointment" });
//     const types2 = new AppointmentType({ name: "Lab Appointment" });
//     const types3 = new AppointmentType({ name: "Radiology Appointment" });

//     await types1.save();
//     await types2.save();
//     await types3.save();
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to retrieve appointment types" },
//       { status: 500 }
//     );
//   }
// }
