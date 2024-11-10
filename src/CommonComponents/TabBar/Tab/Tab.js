import React, { useState } from "react";
import cssClasses from "./Tab.module.css";
import { setDefaultProps } from "../../../modules/Helpers";
import { defaultCallBack } from "../../../modules/DefaultValues";

const defaultProps = Object.freeze({
    id: -1,
    name: '',
    onClick: defaultCallBack,
    isActive: false
});

const Tab = (props) => {
    props = setDefaultProps(props, defaultProps);

    const onClick = () => {
        props.onClick(props.id);
    }

    return (
        <button className={[cssClasses.TabButton, props.isActive ? cssClasses.Active : ''].join(' ')} disabled={props.isActive} onClick={onClick}>
            {props.name}
        </button>
    );
}

export default Tab;