"use client";
import { ForgotPasswordResetPayload } from "../../../types/auth/payloads";
import { ForgotPasswordResetResponse } from "../../../types/auth/responses";
import sliceCreator from "..";
import { FORGOT_PASSWORD_RESET } from "@/constants";

const forgotPasswordResetSlice = sliceCreator<ForgotPasswordResetPayload, ForgotPasswordResetResponse>(
  "forgotPasswordResetAction",
  FORGOT_PASSWORD_RESET,
  "post"
);

const {
  reducer: forgotPasswordResetReducer,
  asyncAction: forgotPasswordResetAction,
  clearData: clearForgotPasswordResetAction,
} = forgotPasswordResetSlice;
export { forgotPasswordResetAction, clearForgotPasswordResetAction };
export default forgotPasswordResetReducer;