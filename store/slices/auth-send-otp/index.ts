"use client";
import { SendOTPPayload } from "../../../types/auth/payloads";
import { SendOTPResponse } from "../../../types/auth/responses";
import sliceCreator from "..";
import { SENDOTP } from "@/constants";

const sendOTPSlice = sliceCreator<SendOTPPayload, SendOTPResponse>(
  "sendOTPAction",
  SENDOTP,
  "post"
);

const {
  reducer: sendOTPReducer,
  asyncAction: sendOTPAction,
  clearData: clearSendOTPAction,
} = sendOTPSlice;
export { sendOTPAction, clearSendOTPAction };
export default sendOTPReducer;