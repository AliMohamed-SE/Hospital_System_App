"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PasskeyModal = ({
  isAdmin,
  userId,
  open,
  setOpen,
}: {
  isAdmin: boolean;
  userId?: string;
  open?: boolean;
  setOpen?: (value: boolean) => void;
}) => {
  const router = useRouter();
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [adminOpen, setAdminOpen] = useState(true);
  // disable resend button
  const [limiting, setLimiting] = useState(false);
  const [limitCountdown, setLimitCountdown] = useState(0);
  // disable enter OTP button
  const [disabled, setDisabled] = useState(false);

  const closeModal = () => {
    setError("");
    setInfo("");
    setPasskey("");
    setOpen && setOpen(false);
    isAdmin && setAdminOpen(false);
    router.push("/");
  };

  const resendPasskey = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setLimiting(true);
    setLimitCountdown(30);
    setError("");

    try {
      if (!isAdmin) {
        console.log(userId);
        const response = await fetch(`/api/auth?userId=${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          setInfo("A new OTP has been sent");
        } else {
          setError("Failed to send OTP");
        }
      }
    } catch (error) {
      setError("An Error has occurred during OTP regeneration");
    }

    const interval = setInterval(() => {
      setLimitCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          // When countdown reaches 0, stop the interval and re-enable the button
          clearInterval(interval);
          setLimiting(false);
          return 0; // Ensure countdown goes to 0
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };

  const validatePasskey = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setDisabled(true);

    try {
      if (!passkey) {
        setError("Please enter your OTP");
      } else if (!isAdmin) {
        const response = await fetch(`/api/auth/token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            passkey: passkey,
          }),
        });

        if (response.ok) {
          const response = await fetch(`/api/patients?userId=${userId}`, {
            method: "GET",
          });

          if (response.ok) {
            const data = await response.json();
            if (data.result.length > 0) {
              router.push(`/patients/${userId}/home`);
            } else {
              router.push(`/patients/${userId}/register`);
            }
          }
        } else {
          const data = await response.json();
          setError(data.error);
        }
      } else {
        if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
          router.push(`/admin`);
        }
      }
    } catch (error) {
      setError(
        "An Error has occurred during OTP Verification, please generate a new one"
      );
    }
    setDisabled(false);
  };
  return (
    <>
      {!isAdmin && (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent className="shad-alert-dialog">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-start justify-between">
                Access Verification
                <Image
                  src="/assets/icons/close.svg"
                  width={20}
                  height={20}
                  alt="close"
                  onClick={() => closeModal()}
                  className="cursor-pointer"
                />
              </AlertDialogTitle>
              <AlertDialogDescription>
                To proceed, please enter the passkey.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div>
              <InputOTP
                maxLength={6}
                value={passkey}
                onChange={(value) => setPasskey(value)}
              >
                <InputOTPGroup className="shad-otp">
                  <InputOTPSlot className="shad-otp-slot" index={0} />
                  <InputOTPSlot className="shad-otp-slot" index={1} />
                  <InputOTPSlot className="shad-otp-slot" index={2} />
                  <InputOTPSlot className="shad-otp-slot" index={3} />
                  <InputOTPSlot className="shad-otp-slot" index={4} />
                  <InputOTPSlot className="shad-otp-slot" index={5} />
                </InputOTPGroup>
              </InputOTP>
              {info && (
                <p className="text-green-400 text-14-regular mt-4 flex justify-center">
                  {info}
                </p>
              )}
              {error && (
                <p className="shad-error text-14-regular mt-4 flex justify-center">
                  {error}
                </p>
              )}
            </div>

            <AlertDialogFooter>
              <AlertDialogAction
                onClick={(e) => validatePasskey(e)}
                className="shad-primary-btn w-full"
                disabled={disabled}
              >
                Enter OTP
              </AlertDialogAction>
              <AlertDialogAction
                onClick={(e) => resendPasskey(e)}
                className="shad-primary-btn w-[200px]"
                disabled={limiting}
              >
                {limiting ? `${limitCountdown} Seconds` : "Resend"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {isAdmin && (
        <AlertDialog open={adminOpen} onOpenChange={setAdminOpen}>
          <AlertDialogContent className="shad-alert-dialog">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-start justify-between">
                Access Verification
                <Image
                  src="/assets/icons/close.svg"
                  width={20}
                  height={20}
                  alt="close"
                  onClick={() => closeModal()}
                  className="cursor-pointer"
                />
              </AlertDialogTitle>
              <AlertDialogDescription>
                To proceed, please enter the passkey.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div>
              <InputOTP
                maxLength={6}
                value={passkey}
                onChange={(value) => setPasskey(value)}
              >
                <InputOTPGroup className="shad-otp">
                  <InputOTPSlot className="shad-otp-slot" index={0} />
                  <InputOTPSlot className="shad-otp-slot" index={1} />
                  <InputOTPSlot className="shad-otp-slot" index={2} />
                  <InputOTPSlot className="shad-otp-slot" index={3} />
                  <InputOTPSlot className="shad-otp-slot" index={4} />
                  <InputOTPSlot className="shad-otp-slot" index={5} />
                </InputOTPGroup>
              </InputOTP>
              {info && (
                <p className="text-green-400 text-14-regular mt-4 flex justify-center">
                  {info}
                </p>
              )}
              {error && (
                <p className="shad-error text-14-regular mt-4 flex justify-center">
                  {error}
                </p>
              )}
            </div>

            <AlertDialogFooter>
              <AlertDialogAction
                onClick={(e) => validatePasskey(e)}
                className="shad-primary-btn w-full"
                disabled={disabled}
              >
                Enter OTP
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default PasskeyModal;
