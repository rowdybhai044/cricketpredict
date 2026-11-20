"use client";
import { LoginSendOTPPayload } from "../../../types/auth/payloads";
import { LoginSendOTPResponse } from "../../../types/auth/responses";
import sliceCreator from "..";
import { LOGINSENDOTP } from "@/constants";

const sendOTPSlice = sliceCreator<LoginSendOTPPayload, LoginSendOTPResponse>(
  "loginSendOTPAction",
  LOGINSENDOTP,
  "post"
);

const {
  reducer: loginSendOTPReducer,
  asyncAction: loginSendOTPAction,
  clearData: clearLoginSendOTPAction,
} = sendOTPSlice;
export { loginSendOTPAction, clearLoginSendOTPAction };
export default loginSendOTPReducer;