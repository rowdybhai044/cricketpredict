import { loginAction, clearLoginAction } from "../slices/auth-login";
import { sendOTPAction, clearSendOTPAction } from "../slices/auth-send-otp";
import { verifyOTPAction, clearVerifyOTPAction } from "../slices/auth-verify-otp"
import { getAllMatchesAction, clearGetAllMatchesAction } from "../slices/get-all-matches"

export {
  loginAction, clearLoginAction,
  sendOTPAction, clearSendOTPAction,
  verifyOTPAction, clearVerifyOTPAction,
  getAllMatchesAction, clearGetAllMatchesAction
}