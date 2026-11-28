"use client";
import { ForgotPasswordSendOTPPayload } from "../../../types/auth/payloads";
import { ForgotPasswordSendOTPResponse } from "../../../types/auth/responses";
import sliceCreator from "..";
import { FORGOT_PASSWORD_SEND_OTP } from "@/constants";

const forgotPasswordSendOTPSlice = sliceCreator<ForgotPasswordSendOTPPayload, ForgotPasswordSendOTPResponse>(
  "forgotPasswordSendOTPAction",
  FORGOT_PASSWORD_SEND_OTP,
  "post"
);

const {
  reducer: forgotPasswordSendOTPReducer,
  asyncAction: forgotPasswordSendOTPAction,
  clearData: clearForgotPasswordSendOTPAction,
} = forgotPasswordSendOTPSlice;
export { forgotPasswordSendOTPAction, clearForgotPasswordSendOTPAction };
export default forgotPasswordSendOTPReducer;