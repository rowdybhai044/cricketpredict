"use client";
import { ResendOTPPayload } from "../../../types/auth/payloads";
import { ResendOTPResponse } from "../../../types/auth/responses";
import sliceCreator from "..";
import { RESENDOTP } from "@/constants";

const resendOTPSlice = sliceCreator<ResendOTPPayload, ResendOTPResponse>(
  "resendOTPAction",
  RESENDOTP,
  "post"
);

const {
  reducer: resendOTPReducer,
  asyncAction: resendOTPAction,
  clearData: clearResendOTPAction,
} = resendOTPSlice;
export { resendOTPAction, clearResendOTPAction };
export default resendOTPReducer;