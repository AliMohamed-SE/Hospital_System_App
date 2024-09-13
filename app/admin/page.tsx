"use client";

import { DataTable } from "@/components/table/DataTable";
import StatCard from "@/components/StatCard";
import { columns } from "@/components/table/columns";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface ICounts {
  scheduledCount: number;
  pendingCount: number;
  cancelledCount: number;
}

const Admin = () => {
  const [appointments, setAppointments] = useState([]);
  const [counts, setCounts] = useState<ICounts>({
    scheduledCount: 0,
    pendingCount: 0,
    cancelledCount: 0,
  });

  const fetchData = async () => {
    const response = await fetch("/api/appointments", { method: "GET" });

    if (response.ok) {
      const data = await response.json();

      setAppointments(data.appointments);
      setCounts(data.counts);
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
        <section className="w-full space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">
            Start the day with managing new appointments
          </p>
        </section>
        <section className="admin-stat">
          <StatCard
            type="appointments"
            count={counts.scheduledCount}
            label="Scheduled appointments"
            icon="/assets/icons/appointments.svg"
          />
          <StatCard
            type="pending"
            count={counts.pendingCount}
            label="Pending appointments"
            icon="/assets/icons/pending.svg"
          />
          <StatCard
            type="cancelled"
            count={counts.cancelledCount}
            label="Cancelled appointments"
            icon="/assets/icons/cancelled.svg"
          />
        </section>

        <DataTable columns={columns(fetchData, true)} data={appointments} />
      </main>
    </div>
  );
};

export default Admin;
