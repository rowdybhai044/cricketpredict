"use client";
import { SignUpSendOTPPayload } from "../../../types/auth/payloads";
import { SignUpSendOTPResponse } from "../../../types/auth/responses";
import sliceCreator from "..";
import { SIGNUPSENDOTP } from "@/constants";

const sendOTPSlice = sliceCreator<SignUpSendOTPPayload, SignUpSendOTPResponse>(
  "signUpSendOTPAction",
  SIGNUPSENDOTP,
  "post"
);

const {
  reducer: signUpSendOTPReducer,
  asyncAction: signUpSendOTPAction,
  clearData: clearSignUpSendOTPAction,
} = sendOTPSlice;
export { signUpSendOTPAction, clearSignUpSendOTPAction };
export default signUpSendOTPReducer;