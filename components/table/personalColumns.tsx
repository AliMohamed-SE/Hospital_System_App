"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Doctor, Lab, Radiology } from "@/types/appwrite.types";
import PersonalModal from "../PersonalModal";

export const personalColumns = (
  onDataSubmit: () => void,
  type: Type
): ColumnDef<Doctor | Lab | Radiology>[] => [
  {
    header: "ID",
    cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <Image
            src={row.original.image}
            alt={row.original.name}
            width={100}
            height={100}
            className="size-8"
          />
          <p className="whitespace-nowrap">{row.original.name}</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row: { original: data } }) => {
      return (
        <div className="flex gap-1">
          <PersonalModal
            buttonType="Edit"
            type={type}
            information={data}
            onDataSubmit={onDataSubmit}
          />
          <PersonalModal
            buttonType="Delete"
            type={type}
            information={data}
            onDataSubmit={onDataSubmit}
          />
        </div>
      );
    },
  },
];
