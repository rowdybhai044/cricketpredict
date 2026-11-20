"use client";
import { VerifyOTPPayload } from "../../../types/auth/payloads";
import { VerifyOTPResponse } from "../../../types/auth/responses";
import sliceCreator from "..";
import { VERIFYOTP } from "@/constants";

const verifyOTPSlice = sliceCreator<VerifyOTPPayload, VerifyOTPResponse>(
  "verifyOTPAction",
  VERIFYOTP,
  "post"
);

const {
  reducer: verifyOTPReducer,
  asyncAction: verifyOTPAction,
  clearData: clearVerifyOTPAction,
} = verifyOTPSlice;
export { verifyOTPAction, clearVerifyOTPAction };
export default verifyOTPReducer;