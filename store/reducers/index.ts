import { combineReducers } from "redux";

import loginSendOTPReducer from "../slices/auth-login-send-otp";
import loginVerifyOTPReducer from "../slices/auth-login-verify-otp";
import signUpSendOTPReducer from "../slices/auth-signup-send-otp";
import signUpVerifyOTPReducer from "../slices/auth-signup-verify-otp";
import getAllMatchesReducer from "../slices/get-all-matches";

const rootReducer = combineReducers({
  loginSendOTPReducer, loginVerifyOTPReducer,
  signUpSendOTPReducer, signUpVerifyOTPReducer,
  getAllMatchesReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
