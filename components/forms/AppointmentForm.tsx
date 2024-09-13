"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { getAppointmentSchema } from "@/lib/validation";
import { Doctors } from "@/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Image from "next/image";
import {
  Appointment,
  AppointmentTypes,
  Doctor,
  Lab,
  Radiology,
} from "@/types/appwrite.types";
import { IDoctor } from "@/models/doctor";
import { IAppointmentTypes } from "@/models/AppointmentType";
import { IAppointment } from "@/models/appointment";

const AppointmentForm = ({
  userId,
  patientId,
  type,
  appointment,
  setOpen,
  refresh,
}: {
  userId: string;
  patientId: string;
  type: "create" | "cancel" | "schedule";
  appointment?: IAppointment;
  setOpen?: (open: boolean) => void;
  refresh?: () => void;
}) => {
  const [list, setList] = useState<IDoctor[]>([]);
  const [appointmentTypes, setAppointmentTypes] = useState<IAppointmentTypes[]>(
    []
  );
  const [currentAppointmentType, setCurrentAppointmentType] =
    useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const AppointmentFormValidation = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      appointmenttype: appointment?.appointmenttype || "",
      primaryPhysician: appointment ? appointment.primaryPhysician : "",
      schedule: appointment
        ? new Date(appointment.schedule)
        : new Date(Date.now()),
      reason: appointment ? appointment.reason : "",
      note: appointment ? appointment.note : "",
      cancellationReason: appointment?.cancellationReason || "",
    },
  });

  const appointmentTypeChanged = async (appointmentTypeId: string) => {
    try {
      const response = await fetch(
        `/api/appointmentTypes?appointmentTypeId=${appointmentTypeId}`,
        { method: "GET" }
      );

      if (response.ok) {
        const data = await response.json();
        const appointmentTypeName = data.types[0].name;
        getListAsync(appointmentTypeName);

        setCurrentAppointmentType(appointmentTypeName);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const getAppointmentTypesAsync = async () => {
    try {
      const response = await fetch("/api/appointmentTypes", {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        const appointmentTypesList = data.types;

        setAppointmentTypes(appointmentTypesList);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getListAsync = async (type: string) => {
    try {
      let response;

      switch (type) {
        case "Lab Appointment":
          response = await fetch("/api/labs", { method: "GET" });
          break;
        case "Radiology Appointment":
          response = await fetch("/api/radiologies", { method: "GET" });
          break;
        default:
          response = await fetch("/api/doctors", { method: "GET" });
          break;
      }

      if (response.ok) {
        const data = await response.json();
        const list = data.list;

        setList(list);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    Promise.all([
      getAppointmentTypesAsync(),
      getListAsync(currentAppointmentType!),
    ]);
  }, []);

  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    let status;

    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "cancelled";
        break;
      default:
        status = "pending";
        break;
    }
    setIsLoading(true);

    console.log(patientId);
    try {
      if (type === "create" && patientId) {
        const appointmentData = {
          userId,
          patient: patientId,
          appointmenttype: values.appointmenttype,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          note: values.note,
          status: status as Status,
        };

        const response = await fetch("/api/appointments", {
          method: "POST",
          body: JSON.stringify(appointmentData),
        });

        if (response.ok) {
          const data = await response.json();
          const appointment = data.appointment;
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${appointment._id}`
          );
        }
      } else if (type === "cancel") {
        const response = await fetch("/api/appointments", {
          method: "DELETE",
          body: JSON.stringify({ appointmentId: appointment?._id! }),
        });

        if (response.ok) {
          refresh && refresh();
          setOpen && setOpen(false);
          form.reset();
        }
      } else {
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?._id!,
          appointment: {
            appointmenttype: values?.appointmenttype,
            primaryPhysician: values?.primaryPhysician,
            schedule: new Date(values?.schedule),
            status: status as Status,
            cancellationReason: values?.cancellationReason,
          },
          type,
        };

        const response = await fetch("/api/appointments", {
          method: "PATCH",
          body: JSON.stringify(appointmentToUpdate),
        });

        if (response.ok) {
          setOpen && setOpen(false);
          form.reset();
        }
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  }

  let buttonLabel;

  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    case "create":
      buttonLabel = "Create Appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
      break;
    default:
      break;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        {type === "create" && (
          <section className="mb-12 space-y-4">
            <h1 className="header">New Appointment</h1>
            <p className="text-dark-700">
              Request a new appointment in 10 seconds
            </p>
          </section>
        )}

        {type !== "cancel" && (
          <>
            <FormField
              control={form.control}
              name="appointmenttype"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Appointment Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        appointmentTypeChanged(value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="shad-select-trigger">
                          <SelectValue placeholder="Select an appointment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="shad-select-content">
                        {appointmentTypes.map((appointmenttype, i) => (
                          <SelectItem
                            key={appointmenttype.name! + i}
                            value={appointmenttype._id.toString()}
                            className="cursor-pointer hover:bg-gray-700"
                          >
                            <div className="flex items-center gap-2">
                              <p>{appointmenttype.name}</p>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="shad-error" />
                </FormItem>
              )}
            />
            {currentAppointmentType && (
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="primaryPhysician"
                label={currentAppointmentType!}
                placeholder={`Select a ${currentAppointmentType}`}
              >
                {list.map((item, i) => (
                  <SelectItem
                    key={item.name + i}
                    value={item.name}
                    className="cursor-pointer hover:bg-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src={item.image}
                        width={32}
                        height={32}
                        alt="doctor | radiology | lab"
                        className="rounded-full border border-dark-500"
                      />
                      <p>{item.name}</p>
                    </div>
                  </SelectItem>
                ))}
              </CustomFormField>
            )}

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Expected appointment date"
              showTimeSelect
              dateformat="MM/dd/yyyy - h:mm aa"
            />

            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Reason for appointment"
                placeholder="Enter reason for appointment"
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Notes"
                placeholder="Enter notes"
              />
            </div>
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Enter reason for cancellation"
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${
            type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"
          } w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForm;
