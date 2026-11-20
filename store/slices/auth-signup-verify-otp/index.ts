"use client";
import { SignUpVerifyOTPPayload } from "../../../types/auth/payloads";
import { SignUpVerifyOTPResponse } from "../../../types/auth/responses";
import sliceCreator from "..";
import { SIGNUPVERIFYOTP } from "@/constants";

const signUpVerifyOTPSlice = sliceCreator<SignUpVerifyOTPPayload, SignUpVerifyOTPResponse>(
  "signUpVerifyOTPAction",
  SIGNUPVERIFYOTP,
  "post"
);

const {
  reducer: signUpVerifyOTPReducer,
  asyncAction: signUpVerifyOTPAction,
  clearData: clearSignUpVerifyOTPAction,
} = signUpVerifyOTPSlice;
export { signUpVerifyOTPAction, clearSignUpVerifyOTPAction };
export default signUpVerifyOTPReducer;