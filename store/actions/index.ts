import { loginSendOTPAction, clearLoginSendOTPAction } from "../slices/auth-login-send-otp";
import { loginVerifyOTPAction, clearLoginVerifyOTPAction } from "../slices/auth-login-verify-otp"
import { signUpSendOTPAction, clearSignUpSendOTPAction } from "../slices/auth-signup-send-otp";
import { signUpVerifyOTPAction, clearSignUpVerifyOTPAction } from "../slices/auth-signup-verify-otp";
import { getAllMatchesAction, clearGetAllMatchesAction } from "../slices/get-all-matches"

export {
  loginSendOTPAction, clearLoginSendOTPAction,
  loginVerifyOTPAction, clearLoginVerifyOTPAction,
  signUpSendOTPAction, clearSignUpSendOTPAction,
  signUpVerifyOTPAction, clearSignUpVerifyOTPAction,
  getAllMatchesAction, clearGetAllMatchesAction,
}