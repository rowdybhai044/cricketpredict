import { loginPasswordAction, clearLoginPasswordAction } from "../slices/auth-login-password";
import { loginSendOTPAction, clearLoginSendOTPAction } from "../slices/auth-login-send-otp";
import { signUpSendOTPAction, clearSignUpSendOTPAction } from "../slices/auth-signup-send-otp";
import { verifyOTPAction, clearVerifyOTPAction } from "../slices/auth-verify-otp"
import { resendOTPAction, clearResendOTPAction } from "../slices/auth-resend-otp";
import { getAllMatchesAction, clearGetAllMatchesAction } from "../slices/get-all-matches"

export {
  loginPasswordAction, clearLoginPasswordAction,
  loginSendOTPAction, clearLoginSendOTPAction,
  signUpSendOTPAction, clearSignUpSendOTPAction,
  verifyOTPAction, clearVerifyOTPAction,
  resendOTPAction, clearResendOTPAction,
  getAllMatchesAction, clearGetAllMatchesAction,
}