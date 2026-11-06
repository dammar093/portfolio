import { combineReducers } from 'redux';
import authReducer from "@/redux/slices/auth-slice";

export const rootReducer = combineReducers({
  auth: authReducer,
})

