"use client";

import { DataTable } from "@/components/table/DataTable";
import { columns } from "@/components/table/columns";
import Image from "next/image";
import Link from "next/link";
import InfoCard from "@/components/InfoCard";
import SignOutButton from "@/components/SignOutButton";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import { IAppointment } from "@/models/appointment";

const Home = () => {
  const router = useRouter();
  const { id } = useParams();

  const [tableType, setTableType] = useState("Doctor Appointment");
  const [appointments, setAppointments] = useState<IAppointment[]>([]);

  const getAppointmentsList = async () => {
    const response = await fetch(
      `/api/appointments?appointmentType=${tableType}&userId=${id}`,
      { method: "GET" }
    );

    if (response.ok) {
      const data = await response.json();
      setAppointments(data.appointments);
    }
  };

  useEffect(() => {
    getAppointmentsList();
  }, [tableType]);

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
          <p className="text-16-semibold">Home</p>
          <SignOutButton />
        </div>
      </header>
      <main className="admin-main">
        <section className="admin-stat mb-5 mt-5">
          <Button onClick={() => setTableType("Doctor Appointment")}>
            <InfoCard type="doctor" icon="/assets/images/doctor.png" />
          </Button>
          <Button onClick={() => setTableType("Lab Appointment")}>
            <InfoCard type="radiology" icon="/assets/images/radiology.png" />
          </Button>
          <Button onClick={() => setTableType("Lab Appointment")}>
            <InfoCard type="lab" icon="/assets/images/lab.png" />
          </Button>
        </section>
        <div className="flex flex-col w-[98%]">
          <Button
            className="outline_btn_dark w-[185px] mb-5 ml-auto mr-1"
            onClick={() => router.push(`/patients/${id}/new-appointment`)}
          >
            Create Appointment
          </Button>
          <DataTable
            columns={columns(getAppointmentsList)}
            data={appointments}
          />
        </div>
      </main>
    </div>
  );
};

export default Home;
