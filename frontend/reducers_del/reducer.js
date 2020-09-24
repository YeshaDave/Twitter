import {combineReducers } from "redux";
import LoginReducer from "./loginReducer"
import OLoginReducer from "./ologinReducer"
import bSignup from "./bSignup"
import { reducer as formReducer } from "redux-form";

const rootReducer = combineReducers({
    form: formReducer,
    loginreducer: LoginReducer,
    ologin: OLoginReducer,
    bSignup: bSignup
})

export default rootReducer

