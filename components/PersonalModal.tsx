"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "./ui/button";
import AppointmentForm from "./forms/AppointmentForm";
import {
  Appointment,
  AppointmentTypes,
  Doctor,
  Lab,
  Radiology,
} from "@/types/appwrite.types";
import PersonalForm from "./forms/PersonalForm";

const PersonalModal = ({
  buttonType,
  type,
  information,
  classname,
  onDataSubmit,
}: {
  buttonType: string;
  type: Type;
  information?: Doctor | Lab | Radiology;
  classname?: string | undefined;
  onDataSubmit?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={`"capitalize text-blue-500" ${classname ?? classname}`}
        >
          {buttonType}
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-md">
        <DialogHeader className="mb-4 space-y-3 ">
          <DialogTitle className="capitalize">
            {buttonType} {type}
          </DialogTitle>
          <DialogDescription>
            Please fill in the following details to {buttonType} a {type}
          </DialogDescription>
        </DialogHeader>

        <PersonalForm
          actionType={buttonType}
          type={type}
          information={information}
          setOpen={setOpen}
          onDataSubmit={onDataSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PersonalModal;
