import React, { createContext } from "react";
import { defaultCallBack } from "../modules/DefaultValues";

const AlertListContext = createContext({
    pushAlert: defaultCallBack
});

export default AlertListContext;