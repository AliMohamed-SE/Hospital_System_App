import { Button } from "@/components/ui/button";
import { getAppointment } from "@/lib/DBactions";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const Success = async ({ params }: SearchParamProps) => {
  const userId = params.id;

  const appointment = await getAppointment(userId);

  return (
    <div className="flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="h-10 w-fit"
          />
        </Link>

        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            height={300}
            width={280}
            alt="success"
            unoptimized
          />
          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">appointment request</span> has
            been successfully submitted!
          </h2>
          <p>We will be in touch shortly to confirm</p>
        </section>

        <section className="request-details">
          <p>Request appointment details:</p>
          <div className="flex items-center gap-3">
            <p className="whitespace-nowrap">
              Dr. {appointment?.primaryPhysician}
            </p>
          </div>
          <div className="flex gap-2">
            <Image
              src="/assets/icons/calendar.svg"
              height={24}
              width={24}
              alt="calendar"
            />
            <p>
              {formatDateTime(appointment?.schedule || new Date()).dateTime}
            </p>
          </div>
        </section>

        <Button variant="outline" className="shad-primary-btn" asChild>
          <Link href={`/patients/${userId}/home`}>Home</Link>
        </Button>
        <div className="text-14-regular mt-20 flex justify-between">
          <p className="justify-items-end text-dark-600 xl:text-left">
            © 2024 CarePulse
          </p>
        </div>
      </div>
    </div>
  );
};

export default Success;
