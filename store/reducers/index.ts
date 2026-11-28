import { combineReducers } from "redux";

import loginPasswordReducer from "../slices/auth-login-password";
import loginSendOTPReducer from "../slices/auth-login-send-otp";
import signUpSendOTPReducer from "../slices/auth-signup-send-otp";
import verifyOTPReducer from "../slices/auth-verify-otp";
import resendOTPReducer from "../slices/auth-resend-otp";
import forgotPasswordSendOTPReducer from "../slices/auth-forgot-password-send-otp";
import forgotPasswordResetReducer from "../slices/auth-forgot-password-reset";
import getAllMatchesReducer from "../slices/get-all-matches";

const rootReducer = combineReducers({
  loginPasswordReducer, loginSendOTPReducer, signUpSendOTPReducer,
  verifyOTPReducer, resendOTPReducer,
  forgotPasswordSendOTPReducer, forgotPasswordResetReducer,
  getAllMatchesReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
