"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { signUpSendOTPAction, clearSignUpSendOTPAction } from "@/store/actions";

export default function Register() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [name, setName] = useState("");
  const [dob, setDob] = useState(""); // YYYY-MM-DD
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const { loading, successData, error: regError, errorInfo } = useAppSelector(
    (state) => state.signUpSendOTPReducer // NEW reducer
  );

  // latest allowed DOB = today minus 18 years
  const maxDob = useMemo(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    return d.toISOString().split("T")[0];
  }, []);

  const validMobile = /^[6-9]\d{9}$/.test(mobile);

  useEffect(() => {
    if (!successData) return;
    toast.success("OTP sent", { description: "Enter 6 digits." });
    router.push(`/verify?m=${encodeURIComponent(mobile)}&t=register`);
    dispatch(clearSignUpSendOTPAction());
  }, [successData, dispatch, router, mobile]);

  useEffect(() => {
    if (!regError) return;
    setError(errorInfo || "Registration failed. Please try again.");
  }, [regError, errorInfo]);

  const submit = () => {
    if (name.trim().length < 2) return setError("Please enter your name.");
    if (!dob) return setError("Please select your date of birth.");
    if (dob > maxDob) return setError("You must be 18 or older to sign up.");
    if (!validMobile) return setError("Please enter a valid 10-digit mobile number.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");
    if (loading) return;

    setError("");

    const payload = {
      name: name.trim(),
      date_of_birth: dob,
      password,
      confirm_password: confirmPassword,
      mobile,
    };

    dispatch(signUpSendOTPAction(payload));
  };

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
        <h1 className="text-2xl font-bold">Create account</h1>
        <p className="mt-2 text-muted">Fill in your details. We&apos;ll text you a 6-digit code.</p>

        <label className="mt-8 block space-y-1.5">
          <span className="text-sm font-medium">Full name</span>
          <Input
            placeholder="Your name"
            autoComplete="name"
            value={name}
            disabled={loading}
            onChange={(e) => { setName(e.target.value); setError(""); }}
          />
        </label>

        <label className="mt-5 block space-y-1.5">
          <span className="text-sm font-medium">Date of birth</span>
          <Input
            type="date"
            max={maxDob}
            value={dob}
            disabled={loading}
            onChange={(e) => { setDob(e.target.value); setError(""); }}
          />
        </label>

        <label className="mt-5 block space-y-1.5">
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
              onChange={(e) => { setMobile(e.target.value.replace(/\D/g, "").slice(0, 10)); setError(""); }}
            />
          </div>
          {mobile.length > 0 && !validMobile && (
            <span className="block text-xs text-danger">Enter a valid 10-digit mobile number.</span>
          )}
        </label>

        <label className="mt-5 block space-y-1.5">
          <span className="text-sm font-medium">Password</span>
          <Input
            type="password"
            autoComplete="new-password"
            placeholder="Create a password"
            value={password}
            disabled={loading}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
          />
        </label>

        <label className="mt-5 block space-y-1.5">
          <span className="text-sm font-medium">Confirm password</span>
          <Input
            type="password"
            autoComplete="new-password"
            placeholder="Confirm your password"
            value={confirmPassword}
            disabled={loading}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError("");
            }}
          />
        </label>

        {error && (
          <p role="alert" className="mt-3 text-sm text-danger">
            {error}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary">
            Log in
          </Link>
        </p>
      </div>

      <Button
        className="w-full"
        disabled={
          !name ||
          !dob ||
          !validMobile ||
          !password ||
          !confirmPassword ||
          password !== confirmPassword ||
          loading
        }
        loading={loading}
        onClick={submit}
      >
        {loading ? "Sending OTP..." : "Continue"}
      </Button>
    </>
  );
}