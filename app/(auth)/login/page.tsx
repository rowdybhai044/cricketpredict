"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearSendOTPAction, sendOTPAction } from "@/store/actions";

export default function Login() {
  const router = useRouter();
  const dispatch = useAppDispatch()

  const [mobile, setMobile] = useState("");
  const [age, setAge] = useState(false);
  const [error, setError] = useState('');

  const valid = /^[6-9]\d{9}$/.test(mobile);

  const {
    loading: sendOTPLoading,
    successData: sendOTPSuccessData,
    error: sendOTPError,
    errorInfo: sendOTPErrorInfo,
  } = useAppSelector((state) => state.sendOTPReducer);

  // Handle OTP success
  useEffect(() => {
    if (!sendOTPSuccessData) return;

    toast.success("OTP sent", {
      description: "Enter 6 digits.",
    });

    router.push(`/verify?m=${encodeURIComponent(mobile)}`);

    dispatch(clearSendOTPAction());
  }, [sendOTPSuccessData, dispatch, router, mobile]);

  // Handle API errors
  useEffect(() => {
    if (!sendOTPError) return;

    setError(
      sendOTPErrorInfo || "Something went wrong. Please try again."
    );
  }, [sendOTPError, sendOTPErrorInfo]);

  // Handle mobile input
  const handleMobileChange = (value: string) => {
    setMobile(value.replace(/\D/g, "").slice(0, 10));
    setError("");
  };

  // Submit OTP request
  const submit = () => {
    if (!valid) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!age) {
      setError("Please confirm that you are 18 or older.");
      return;
    }

    if (sendOTPLoading) return;

    setError("");

    dispatch(sendOTPAction({ mobile }));
  };

  return (
    <>
      <span className="text-xl font-bold tracking-tight">
        Toss<span className="text-primary">Win</span>
      </span>
      <div className="mt-14 flex-1">
        <h1 className="text-2xl font-bold">Log in or sign up</h1>
        <p className="mt-2 text-muted">
          Enter your mobile number. We&apos;ll text you a 6-digit code.
        </p>

        <label className="mt-8 block space-y-1.5">
          <span className="text-sm font-medium">Mobile number</span>
          <div className="flex gap-2">
            <div className="flex h-12 items-center rounded-xl border border-border bg-elevated px-4 text-[15px] text-muted">
              +91
            </div>
            <Input
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="98765 43210"
              maxLength={10}
              value={mobile}
              disabled={sendOTPLoading}
              onChange={(e) => handleMobileChange(e.target.value)}
            />
          </div>
          {mobile.length > 0 && !valid && (
            <span className="block text-xs text-danger">
              Enter a valid 10-digit mobile number.</span>
          )}
        </label>

        <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm text-muted">
          <input
            type="checkbox"
            checked={age}
            disabled={sendOTPLoading}
            onChange={(e) => setAge(e.target.checked)}
            className="mt-0.5 h-5 w-5 accent-[rgb(var(--c-primary))]"
          />
          I'm 18 or older and agree to the Terms and Privacy Policy.
        </label>

        {/* API error */}
        {error && (
          <p
            role="alert"
            className="mt-3 text-sm text-danger"
          >
            {error}
          </p>
        )}
      </div>
      <Button
        className="w-full"
        disabled={!valid || !age || sendOTPLoading}
        loading={sendOTPLoading}
        onClick={submit}
      >
        {sendOTPLoading ? "Sending OTP..." : "Send OTP"}
      </Button>
    </>
  );
}
