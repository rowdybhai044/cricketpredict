"use client";
import { LoginPayload } from "../../../types/auth/payloads";
import { LoginResponse } from "../../../types/auth/responses";
import sliceCreator from "..";
import { LOGIN } from "@/constants";

const loginSlice = sliceCreator<LoginPayload, LoginResponse>(
  "loginAction",
  LOGIN,
  "post"
);

const {
  reducer: loginReducer,
  asyncAction: loginAction,
  clearData: clearLoginAction,
} = loginSlice;
export { loginAction, clearLoginAction };
export default loginReducer;