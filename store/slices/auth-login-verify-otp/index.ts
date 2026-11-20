"use client";
import { LoginVerifyOTPPayload } from "../../../types/auth/payloads";
import { LoginVerifyOTPResponse } from "../../../types/auth/responses";
import sliceCreator from "..";
import { LOGINVERIFYOTP } from "@/constants";

const loginVerifyOTPSlice = sliceCreator<LoginVerifyOTPPayload, LoginVerifyOTPResponse>(
  "loginVerifyOTPAction",
  LOGINVERIFYOTP,
  "post"
);

const {
  reducer: loginVerifyOTPReducer,
  asyncAction: loginVerifyOTPAction,
  clearData: clearLoginVerifyOTPAction,
} = loginVerifyOTPSlice;
export { loginVerifyOTPAction, clearLoginVerifyOTPAction };
export default loginVerifyOTPReducer;