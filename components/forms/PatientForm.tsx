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
import { UserFormValidation } from "@/lib/validation";
import PasskeyModal from "../PasskeyModal";

const PatientForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      phone: "",
    },
  });

  async function onSubmit({ phone }: z.infer<typeof UserFormValidation>) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phone,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const userId = data.userId;

        setError("");
        setUserId(userId);
      } else {
        const data = await response.json();

        setUserId("");
        setError(data.error);
      }
    } catch (error: any) {
      setError(
        "An Error has occurred in form submission, please try again later"
      );
    }

    setIsLoading(false);
  }
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 flex-1"
        >
          <section className="mb-12 space-y-4">
            <h1 className="header">Hi There 👋</h1>
            <p className="text-dark-700">Schedule your appointment</p>
          </section>
          <CustomFormField
            fieldType={FormFieldType.PHONE_Input}
            control={form.control}
            name="phone"
            label="Phone number"
            placeholder="(555) 123-4567"
          />
          {error && <p className="text-center text-red-500">{error}</p>}
          <SubmitButton isLoading={isLoading}>Get OTP</SubmitButton>
        </form>
      </Form>

      <PasskeyModal
        isAdmin={false}
        userId={userId}
        open={!!userId}
        setOpen={() => setUserId("")}
      />
    </>
  );
};

export default PatientForm;
