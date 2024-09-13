import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const NotFound = async () => {
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
          <h2 className="header mb-6 max-w-[600px] text-center">
            This page does not exist
          </h2>
        </section>

        <Button variant="outline" className="shad-primary-btn" asChild>
          <Link href="/">Back to home</Link>
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

export default NotFound;
