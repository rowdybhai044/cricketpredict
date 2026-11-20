import { combineReducers } from "redux";

import loginReducer from "../slices/auth-login";
import sendOTPReducer from "../slices/auth-send-otp";
import verifyOTPReducer from "../slices/auth-verify-otp";
import getAllMatchesReducer from "../slices/get-all-matches";

const rootReducer = combineReducers({
  loginReducer,
  sendOTPReducer, verifyOTPReducer,
  getAllMatchesReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
