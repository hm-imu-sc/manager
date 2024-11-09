import React from "react";
import Alert from "./Alert/Alert";
import cssClasses from "./AlertBox.module.css";

const AlertBox = (props) => {
    return (
        <div className={cssClasses.RootDiv}>
            {props.children}
        </div>
    );
}

export default AlertBox;