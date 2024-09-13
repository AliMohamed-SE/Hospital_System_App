"use client";

import { useState } from "react";

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
import { PersonalFormValidation } from "@/lib/validation";
import { Doctor, Lab, Radiology } from "@/types/appwrite.types";
import FileUploader from "../FileUploader";

const PersonalForm = ({
  actionType,
  type,
  information,
  setOpen,
  onDataSubmit,
}: {
  actionType: string;
  type: Type;
  information?: Doctor | Lab | Radiology;
  setOpen?: (open: boolean) => void;
  onDataSubmit?: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof PersonalFormValidation>>({
    resolver: zodResolver(PersonalFormValidation),
    defaultValues: {
      name: information?.name || "",
      image: [],
    },
  });

  async function onSubmit({
    name,
    image,
  }: z.infer<typeof PersonalFormValidation>) {
    setIsLoading(true);
    let imageUrl;

    if (image && image.length > 0) {
      const formData = new FormData();
      formData.append("file", image[0]);
      formData.append("upload_preset", "pqca8ffg");

      // Upload Image to cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        imageUrl = data.secure_url;
      } else {
        setError("failed to upload image");
      }
    } else {
      if (actionType === "Create") {
        setError("Please upload an image");
        return;
      }
    }

    try {
      let actionResponse;
      if (actionType === "Edit") {
        switch (type) {
          case "doctor":
            actionResponse = await fetch(`/api/doctors`, {
              method: "PATCH",
              body: JSON.stringify({
                doctorId: information?._id,
                name: name,
                url: imageUrl || "",
              }),
            });
            break;
          case "lab":
            actionResponse = await fetch(`/api/labs`, {
              method: "PATCH",
              body: JSON.stringify({
                labId: information?._id,
                name: name,
                url: imageUrl || "",
              }),
            });
            break;
          case "radiology":
            actionResponse = await fetch(`/api/radiologies`, {
              method: "PATCH",
              body: JSON.stringify({
                radiologyId: information?._id,
                name: name,
                url: imageUrl || "",
              }),
            });
            break;
          default:
            break;
        }
      } else if (actionType === "Delete") {
        switch (type) {
          case "doctor":
            actionResponse = await fetch(`/api/doctors`, {
              method: "DELETE",
              body: JSON.stringify({
                doctorId: information?._id,
              }),
            });
            break;
          case "lab":
            actionResponse = await fetch(`/api/labs`, {
              method: "DELETE",
              body: JSON.stringify({
                labId: information?._id,
              }),
            });
            break;
          case "radiology":
            actionResponse = await fetch(`/api/radiologies`, {
              method: "DELETE",
              body: JSON.stringify({
                radiologyId: information?._id,
              }),
            });
            break;
          default:
            break;
        }
      } else {
        switch (type) {
          case "doctor":
            actionResponse = await fetch(`/api/doctors`, {
              method: "POST",
              body: JSON.stringify({
                name: name,
                url: imageUrl,
              }),
            });
            break;
          case "lab":
            actionResponse = await fetch(`/api/labs`, {
              method: "POST",
              body: JSON.stringify({
                name: name,
                url: imageUrl,
              }),
            });
            break;
          case "radiology":
            actionResponse = await fetch(`/api/radiologies`, {
              method: "POST",
              body: JSON.stringify({
                name: name,
                url: imageUrl,
              }),
            });
            break;
          default:
            break;
        }
      }

      if (actionResponse!.ok) {
        onDataSubmit && onDataSubmit();
        setOpen && setOpen(false);
        form.reset();
      } else {
        setError("Failed to perform action");
      }
    } catch (error: any) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        {actionType !== "Delete" && (
          <>
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="name"
              label="Name"
              placeholder="name"
              iconSrc="/assets/icons/user.svg"
              iconAlt="user"
            />
            <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="image"
              label="Image"
              renderSkeleton={(field) => (
                <FormControl>
                  <FileUploader files={field.value} onChange={field.onChange} />
                </FormControl>
              )}
            />
          </>
        )}
        {actionType === "Delete" && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for deletion"
            placeholder="Enter reason for deletion"
          />
        )}
        {error && (
          <p className="shad-error text-14-regular mt-4 flex justify-center">
            {error}
          </p>
        )}
        <SubmitButton isLoading={isLoading}>{actionType}</SubmitButton>
      </form>
    </Form>
  );
};

export default PersonalForm;
