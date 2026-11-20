
"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { KeyboardEvent, ClipboardEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { maskMobile } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginVerifyOTPAction, clearLoginVerifyOTPAction, loginSendOTPAction, clearLoginSendOTPAction } from "@/store/actions";

function VerifyInner() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mobile number received from Login page
  const mobile = searchParams.get("m") ?? "";

  const {
    loading: sendOTPLoading,
    successData: sendOTPSuccessData,
    error: sendOTPError,
    errorInfo: sendOTPErrorInfo,
  } = useAppSelector((state) => state.loginSendOTPReducer);

  const {
    loading: verifyOTPLoading,
    successData: verifyOTPSuccessData,
    error: verifyOTPError,
    errorInfo: verifyOTPErrorInfo,
  } = useAppSelector((state) => state.loginVerifyOTPReducer);

  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [t, setT] = useState(30);
  const [error, setError] = useState("");

  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const code = digits.join("");

  // Redirect if mobile number is missing
  useEffect(() => {
    if (!mobile) {
      router.replace("/login");
    }
  }, [mobile, router]);

  // Timer
  useEffect(() => {
    if (t <= 0) return;

    const id = setTimeout(() => setT((prev) => prev - 1), 1000);

    return () => clearTimeout(id);
  }, [t]);

  // Handle successful verification
  useEffect(() => {
    if (!verifyOTPSuccessData) return;

    const userData = verifyOTPSuccessData?.user

    toast.success("Mobile number verified");
    localStorage.setItem("token", verifyOTPSuccessData?.tokens?.access)
    localStorage.setItem("role", userData?.role)
    localStorage.setItem("userId", String(userData?.id))
    localStorage.setItem("name", userData?.name)
    localStorage.setItem("dob", userData?.date_of_birth)
    localStorage.setItem("wallet", userData?.wallet_balance)
    localStorage.setItem("date_joined", userData?.date_joined)

    if (userData?.role === "user") {
      router.push("/");
    } else if (userData?.role === "admin") {
      router.push("/");
    }

  }, [verifyOTPSuccessData, router]);

  // Handle API errors
  useEffect(() => {
    if (!verifyOTPError) return;

    setError(
      verifyOTPErrorInfo || "Invalid OTP. Please try again."
    );
  }, [verifyOTPError, verifyOTPErrorInfo]);

  useEffect(() => {
    if (!sendOTPSuccessData) return;

    toast.success("OTP resent successfully");

    setDigits(Array(6).fill(""));
    setT(30);

    dispatch(clearLoginSendOTPAction());
  }, [sendOTPSuccessData, dispatch]);

  useEffect(() => {
    if (!sendOTPError) return;

    setError(
      sendOTPErrorInfo || "Unable to resend OTP. Please try again."
    );
  }, [sendOTPError, sendOTPErrorInfo]);

  // Handle OTP input
  const handleChange = (i: number, value: string) => {
    const c = value.replace(/\D/g, "").slice(-1);

    const next = [...digits];
    next[i] = c;

    setDigits(next);
    setError("");

    if (c && i < 5) {
      refs.current[i + 1]?.focus();
    }
  };

  // Handle backspace
  const onKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  // Handle paste OTP
  const onPaste = (e: ClipboardEvent<HTMLDivElement>) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (pasted) {
      e.preventDefault();

      setDigits(
        Array.from({ length: 6 }, (_, i) => pasted[i] ?? "")
      );

      setError("");

      refs.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  const resendOTP = () => {
    if (sendOTPLoading || t > 0) return;

    setError("");

    dispatch(loginSendOTPAction({ mobile }));
  };

  // Verify OTP API
  const verify = () => {
    if (!mobile) {
      setError("Mobile number is missing.");
      return;
    }

    if (code.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    if (verifyOTPLoading) return;

    setError("");

    // Send mobile + OTP to backend
    dispatch(
      loginVerifyOTPAction({
        mobile: mobile,
        otp: code,
      })
    );
  };

  if (!mobile) return null;

  return (
    <>
      <button
        onClick={() => router.back()}
        aria-label="Back"
        className="-ml-2 w-fit rounded-full p-2 hover:bg-elevated"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      <div className="mt-6 flex-1">
        <h1 className="text-2xl font-bold">
          Enter the code
        </h1>

        <p className="mt-2 text-muted">
          Sent to {maskMobile(mobile)}
        </p>

        {/* OTP inputs */}
        <div
          className="mt-8 flex justify-between gap-2"
          onPaste={onPaste}
        >
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              value={digit}
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              aria-label={`Digit ${i + 1}`}
              disabled={verifyOTPLoading}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => onKey(i, e)}
              className="h-14 w-full min-w-0 rounded-xl border border-border bg-elevated text-center text-xl font-semibold tabular-nums focus-visible:border-primary"
            />
          ))}
        </div>

        {/* Error message */}
        {error && (
          <p role="alert" className="mt-3 text-sm text-danger">
            {error}
          </p>
        )}

        {/* Resend OTP timer */}
        <p className="mt-5 text-sm text-muted">
          {t > 0 ? (
            `Resend code in 0:${String(t).padStart(2, "0")}`
          ) : (
            <button
              type="button"
              disabled={sendOTPLoading}
              className="font-semibold text-primary disabled:opacity-50"
              onClick={resendOTP}
            >
              {sendOTPLoading ? "Resending..." : "Resend code"}
            </button>
          )}
        </p>
      </div>

      {/* Verify button */}
      <Button
        className="w-full"
        disabled={code.length !== 6 || verifyOTPLoading}
        loading={verifyOTPLoading}
        onClick={verify}
      >
        {verifyOTPLoading ? "Verifying..." : "Verify"}
      </Button>
    </>
  );
}

export default function Verify() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyInner />
    </Suspense>
  );
}
