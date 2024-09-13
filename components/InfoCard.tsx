import clsx from "clsx";
import Image from "next/image";

const InfoCard = ({
  type,
  icon,
}: {
  type: "doctor" | "radiology" | "lab";
  icon: string;
}) => {
  return (
    <div
      className={clsx("info-card", {
        "bg-appointments": type === "doctor",
        "bg-pending": type === "radiology",
        "bg-cancelled": type === "lab",
      })}
    >
      <div className="flex items-center gap-4 justify-center">
        <Image
          src={icon}
          height={32}
          width={32}
          alt="icon"
          className="size-8 w-fit"
        />
        <h2 className="text-18-semibold text-white capitalize">
          {type} Appointments
        </h2>
      </div>
    </div>
  );
};

export default InfoCard;
