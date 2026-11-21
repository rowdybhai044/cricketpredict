"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  loginSendOTPAction,
  clearLoginSendOTPAction,
  loginPasswordAction,
  clearLoginPasswordAction,
} from "@/store/actions";
import { saveAuth } from "@/lib/auth";

type Mode = "otp" | "password";

export default function Login() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [mode, setMode] = useState<Mode>("otp");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const valid = /^[6-9]\d{9}$/.test(mobile);

  const {
    loading: sendOTPLoading,
    successData: sendOTPSuccessData,
    error: sendOTPError,
    errorInfo: sendOTPErrorInfo,
  } = useAppSelector((state) => state.loginSendOTPReducer);

  const {
    loading: pwLoading,
    successData: pwSuccessData,
    error: pwError,
    errorInfo: pwErrorInfo,
  } = useAppSelector((state) => state.loginPasswordReducer);

  const loading = sendOTPLoading || pwLoading;

  // OTP success
  useEffect(() => {
    if (!sendOTPSuccessData) return;
    toast.success("OTP sent", { description: "Enter 6 digits." });
    router.push(`/verify?m=${encodeURIComponent(mobile)}&t=login`);
    dispatch(clearLoginSendOTPAction());
  }, [sendOTPSuccessData, dispatch, router, mobile]);

  // Password login success
  useEffect(() => {
    if (!pwSuccessData) return;

    saveAuth(pwSuccessData);
    toast.success("Logged in");

    const role = pwSuccessData?.user?.role

    if (role === "user") {
      router.push("/");
    } else if (role === "admin") {
      router.push("/");
    }
    dispatch(clearLoginPasswordAction());
  }, [pwSuccessData, dispatch, router]);

  // Errors
  useEffect(() => {
    if (!sendOTPError) return;
    setError(sendOTPErrorInfo || "Something went wrong. Please try again.");
  }, [sendOTPError, sendOTPErrorInfo]);

  useEffect(() => {
    if (!pwError) return;
    setError(pwErrorInfo || "Invalid mobile number or password.");
  }, [pwError, pwErrorInfo]);

  const handleMobileChange = (value: string) => {
    setMobile(value.replace(/\D/g, "").slice(0, 10));
    setError("");
  };

  const switchMode = (m: Mode) => {
    if (loading) return;
    setMode(m);
    setError("");
    setPassword("");
  };

  const submit = () => {
    if (!valid) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (loading) return;
    setError("");

    if (mode === "otp") {
      dispatch(loginSendOTPAction({ mobile }));
    } else {
      if (!password) {
        setError("Please enter your password.");
        return;
      }
      dispatch(loginPasswordAction({ mobile, password }));
    }
  };

  const tabClass = (active: boolean) =>
    `flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${active ? "bg-primary text-white" : "text-muted"
    }`;

  return (
    <>
      <span className="text-xl font-bold tracking-tight">
        Toss<span className="text-primary">Win</span>
      </span>

      <div className="mt-14 flex-1">
        <h1 className="text-2xl font-bold">Log in</h1>
        <p className="mt-2 text-muted">
          {mode === "otp"
            ? "Enter your mobile number. We'll text you a 6-digit code."
            : "Enter your mobile number and password."}
        </p>

        {/* Tab switch */}
        <div className="mt-6 flex gap-1 rounded-xl border border-border bg-elevated p-1">
          <button type="button" className={tabClass(mode === "otp")} onClick={() => switchMode("otp")}>
            Login with OTP
          </button>
          <button type="button" className={tabClass(mode === "password")} onClick={() => switchMode("password")}>
            Login with Password
          </button>
        </div>

        <label className="mt-6 block space-y-1.5">
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
              disabled={loading}
              onChange={(e) => handleMobileChange(e.target.value)}
            />
          </div>
          {mobile.length > 0 && !valid && (
            <span className="block text-xs text-danger">Enter a valid 10-digit mobile number.</span>
          )}
        </label>

        {mode === "password" && (
          <label className="mt-5 block space-y-1.5">
            <span className="text-sm font-medium">Password</span>
            <Input
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              disabled={loading}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
          </label>
        )}

        {error && (
          <p role="alert" className="mt-3 text-sm text-danger">
            {error}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-primary">
            Sign up
          </Link>
        </p>
      </div>

      <Button
        className="w-full"
        disabled={!valid || (mode === "password" && !password) || loading}
        loading={loading}
        onClick={submit}
      >
        {mode === "otp"
          ? sendOTPLoading ? "Sending OTP..." : "Send OTP"
          : pwLoading ? "Logging in..." : "Log in"}
      </Button>
    </>
  );
}