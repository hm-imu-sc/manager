import React from "react";
import cssClasses from "./ToggleSwitch.module.css";
import { setDefaultProps } from "../../modules/Helpers";
import FAIcon from "../FAIcon/FAIcon";
import { defaultCallBack } from "../../modules/DefaultValues";

const defaultProps = Object.freeze({
    state: false,
    text: '',
    onClick: defaultCallBack
});

const ToggleSwitch = props => {
    props = setDefaultProps(props, defaultProps);

    return (
        <div className={cssClasses.RootDiv}>
            <div className={cssClasses.Icon} onClick={props.onClick}><FAIcon iconClasses={[props.state ? 'fad fa-toggle-on' : 'fad fa-toggle-off']} /></div>
            <div className={cssClasses.Text}>{props.text}</div>
        </div>
    );
}

export default ToggleSwitch;