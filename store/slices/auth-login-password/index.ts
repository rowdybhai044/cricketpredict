"use client";
import { LoginPasswordPayload } from "../../../types/auth/payloads";
import { LoginPasswordResponse } from "../../../types/auth/responses";
import sliceCreator from "..";
import { LOGINPASSWORD } from "@/constants";

const loginPasswordSlice = sliceCreator<LoginPasswordPayload, LoginPasswordResponse>(
  "loginPasswordAction",
  LOGINPASSWORD,
  "post"
);

const {
  reducer: loginPasswordReducer,
  asyncAction: loginPasswordAction,
  clearData: clearLoginPasswordAction,
} = loginPasswordSlice;
export { loginPasswordAction, clearLoginPasswordAction };
export default loginPasswordReducer;