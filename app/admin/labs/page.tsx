"use client";

import { DataTable } from "@/components/table/DataTable";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { personalColumns } from "@/components/table/personalColumns";
import PersonalModal from "@/components/PersonalModal";

const Labs = () => {
  const [labs, setLabs] = useState([]);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/labs`, { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        setLabs(data.list);
      } else {
        console.error("Failed to fetch labs");
      }
    } catch (error) {
      console.error("Error fetching labs:", error);
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
            <h1 className="header">Labs</h1>
            <p className="text-dark-700">Labs Management</p>
          </div>
          <PersonalModal
            buttonType="Create"
            type="lab"
            classname="outline_btn_dark"
            onDataSubmit={fetchData}
          />
        </section>

        <DataTable columns={personalColumns(fetchData, "lab")} data={labs} />
      </main>
    </div>
  );
};

export default Labs;
