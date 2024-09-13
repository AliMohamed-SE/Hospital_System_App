"use client";

import { DataTable } from "@/components/table/DataTable";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { personalColumns } from "@/components/table/personalColumns";
import PersonalModal from "@/components/PersonalModal";

const Radiologies = () => {
  const [radiologies, setRadiologies] = useState([]);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/radiologies`, { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        setRadiologies(data.list);
      } else {
        console.error("Failed to fetch radiologies");
      }
    } catch (error) {
      console.error("Error fetching radiologies:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/assets/icons/logo-full.svg"
            height={32}
            width={162}
            alt="logo"
            className="h-8 w-fit"
          />
        </Link>
        <div className="flex flex-row gap-6 items-center">
          <Link href="/admin">
            <p className="text-16-semibold">Home</p>
          </Link>
          <Link href="/admin/doctors">
            <p className="text-16-semibold">Doctors</p>
          </Link>
          <Link href="/admin/labs">
            <p className="text-16-semibold">Labs</p>
          </Link>
          <Link href="/admin/radiologies">
            <p className="text-16-semibold">Radiologies</p>
          </Link>
          <Link href="/">
            <button type="button" className="outline_btn">
              Sign Out
            </button>
          </Link>
        </div>
      </header>
      <main className="admin-main">
        <section className="flex flex-row justify-between w-full">
          <div className="w-full space-y-4">
            <h1 className="header">Radiologies</h1>
            <p className="text-dark-700">Radiologies Management</p>
          </div>
          <PersonalModal
            buttonType="Create"
            type="radiology"
            classname="outline_btn_dark"
            onDataSubmit={fetchData}
          />
        </section>

        <DataTable
          columns={personalColumns(fetchData, "radiology")}
          data={radiologies}
        />
      </main>
    </div>
  );
};

export default Radiologies;
