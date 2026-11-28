"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OtpInput } from "@/components/otp-input";
import { maskMobile } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  forgotPasswordSendOTPAction,
  clearForgotPasswordSendOTPAction,
  forgotPasswordResetAction,
  clearForgotPasswordResetAction,
  resendOTPAction,
  clearResendOTPAction,
} from "@/store/actions";

const RESEND_SECONDS = 30;

function ForgotPasswordInner() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<1 | 2>(1);
  const [mobile, setMobile] = useState(() => {
    const m = searchParams.get("m") ?? "";
    return /^[6-9]\d{9}$/.test(m) ? m : "";
  });
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [t, setT] = useState(RESEND_SECONDS);
  const [error, setError] = useState("");

  const validMobile = /^[6-9]\d{9}$/.test(mobile);

  const sendState = useAppSelector((s) => s.forgotPasswordSendOTPReducer);
  const resetState = useAppSelector((s) => s.forgotPasswordResetReducer);
  const resendState = useAppSelector((s) => s.resendOTPReducer);

  const busy = sendState.loading || resetState.loading || resendState.loading;

  // Clear stale redux state on mount
  useEffect(() => {
    dispatch(clearForgotPasswordSendOTPAction());
    dispatch(clearForgotPasswordResetAction());
    dispatch(clearResendOTPAction());
  }, [dispatch]);

  // Resend timer (only on step 2)
  useEffect(() => {
    if (step !== 2 || t <= 0) return;
    const id = setTimeout(() => setT((p) => p - 1), 1000);
    return () => clearTimeout(id);
  }, [step, t]);

  // Send OTP success -> step 2
  useEffect(() => {
    if (!sendState.successData) return;
    toast.success("OTP sent", { description: "Enter the 6-digit code." });
    setStep(2);
    setT(RESEND_SECONDS);
    setOtp("");
    setError("");
    dispatch(clearForgotPasswordSendOTPAction());
  }, [sendState.successData, dispatch]);

  useEffect(() => {
    if (!sendState.error) return;
    setError(sendState.errorInfo || "Unable to send OTP. Please try again.");
    dispatch(clearForgotPasswordSendOTPAction());
  }, [sendState.error, sendState.errorInfo, dispatch]);

  // Resend success / error
  useEffect(() => {
    if (!resendState.successData) return;
    toast.success("OTP resent successfully");
    setOtp("");
    setT(RESEND_SECONDS);
    setError("");
    dispatch(clearResendOTPAction());
  }, [resendState.successData, dispatch]);

  useEffect(() => {
    if (!resendState.error) return;
    setError(resendState.errorInfo || "Unable to resend OTP. Please try again.");
    dispatch(clearResendOTPAction());
  }, [resendState.error, resendState.errorInfo, dispatch]);

  // Reset success -> login
  useEffect(() => {
    if (!resetState.successData) return;
    toast.success("Password reset successfully. Please log in.");
    dispatch(clearForgotPasswordResetAction());
    router.replace("/login");
  }, [resetState.successData, dispatch, router]);

  useEffect(() => {
    if (!resetState.error) return;
    setError(resetState.errorInfo || "Unable to reset password. Please try again.");
    dispatch(clearForgotPasswordResetAction());
  }, [resetState.error, resetState.errorInfo, dispatch]);

  const sendOTP = () => {
    if (!validMobile) return setError("Please enter a valid 10-digit mobile number.");
    if (busy) return;
    setError("");
    dispatch(forgotPasswordSendOTPAction({ mobile }));
  };

  const resendOTP = () => {
    if (busy || t > 0) return;
    setError("");
    dispatch(resendOTPAction({ mobile, action: "forgot_password" }));
  };

  const reset = () => {
    if (otp.length !== 6) return setError("Please enter the complete 6-digit OTP.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    if (busy) return;
    setError("");
    dispatch(
      forgotPasswordResetAction({
        mobile,
        otp,
        new_password: password,
        confirm_new_password: confirm,
      })
    );
  };

  const goBack = () => {
    if (step === 2) {
      if (busy) return;
      setStep(1);
      setOtp("");
      setPassword("");
      setConfirm("");
      setError("");
    } else {
      router.back();
    }
  };

  const mismatch = confirm.length > 0 && password !== confirm;

  return (
    <>
      <button
        onClick={goBack}
        aria-label="Back"
        className="-ml-2 w-fit rounded-full p-2 hover:bg-elevated"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      {/* Step indicator */}
      <div className="mt-4 flex gap-1.5" aria-label={`Step ${step} of 2`}>
        <div className="h-1 flex-1 rounded-full bg-primary" />
        <div className={`h-1 flex-1 rounded-full ${step === 2 ? "bg-primary" : "bg-border"}`} />
      </div>

      {step === 1 ? (
        <>
          <div className="mt-6 flex-1">
            <h1 className="text-2xl font-bold">Forgot password?</h1>
            <p className="mt-2 text-muted">
              Enter your registered mobile number. We&apos;ll text you a 6-digit code.
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
                  disabled={busy}
                  onChange={(e) => {
                    setMobile(e.target.value.replace(/\D/g, "").slice(0, 10));
                    setError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && sendOTP()}
                />
              </div>
              {mobile.length > 0 && !validMobile && (
                <span className="block text-xs text-danger">
                  Enter a valid 10-digit mobile number.
                </span>
              )}
            </label>

            {error && (
              <p role="alert" className="mt-3 text-sm text-danger">
                {error}
              </p>
            )}

            <p className="mt-6 text-center text-sm text-muted">
              Remembered it?{" "}
              <Link href="/login" className="font-semibold text-primary">
                Log in
              </Link>
            </p>
          </div>

          <Button
            className="w-full"
            disabled={!validMobile || busy}
            loading={sendState.loading}
            onClick={sendOTP}
          >
            {sendState.loading ? "Sending OTP..." : "Send OTP"}
          </Button>
        </>
      ) : (
        <>
          <div className="mt-6 flex-1">
            <h1 className="text-2xl font-bold">Reset password</h1>
            <p className="mt-2 text-muted">
              Code sent to +91 {maskMobile(mobile)}.{" "}
              <button
                type="button"
                onClick={goBack}
                className="font-semibold text-primary"
              >
                Change
              </button>
            </p>

            <div className="mt-8">
              <OtpInput value={otp} onChange={(v) => { setOtp(v); setError(""); }} disabled={busy} />
            </div>

            <p className="mt-4 text-sm text-muted">
              {t > 0 ? (
                `Resend code in 0:${String(t).padStart(2, "0")}`
              ) : (
                <button
                  type="button"
                  disabled={busy}
                  className="font-semibold text-primary disabled:opacity-50"
                  onClick={resendOTP}
                >
                  {resendState.loading ? "Resending..." : "Resend code"}
                </button>
              )}
            </p>

            <label className="mt-8 block space-y-1.5">
              <span className="text-sm font-medium">New password</span>
              <div className="relative">
                <Input
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                  value={password}
                  disabled={busy}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                />
                <button
                  type="button"
                  aria-label={showPw ? "Hide password" : "Show password"}
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                >
                  {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </label>

            <label className="mt-5 block space-y-1.5">
              <span className="text-sm font-medium">Confirm new password</span>
              <Input
                type={showPw ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Re-enter password"
                value={confirm}
                disabled={busy}
                onChange={(e) => { setConfirm(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && reset()}
              />
              {mismatch && (
                <span className="block text-xs text-danger">Passwords do not match.</span>
              )}
            </label>

            {error && (
              <p role="alert" className="mt-3 text-sm text-danger">
                {error}
              </p>
            )}
          </div>

          <Button
            className="w-full"
            disabled={otp.length !== 6 || !password || !confirm || mismatch || busy}
            loading={resetState.loading}
            onClick={reset}
          >
            {resetState.loading ? "Resetting..." : "Reset password"}
          </Button>
        </>
      )}
    </>
  );
}

export default function ForgotPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPasswordInner />
    </Suspense>
  );
}