import React from "react";
import { setDefaultProps } from "../../modules/Helpers";
import cssClasses from "./RenderOnCondition.module.css";

const defaultProps = {
    condition: false
}

const RenderOnCondition = (props) => {
    props = setDefaultProps(props, defaultProps);
    return props.condition ? props.children : null;
}

export default RenderOnCondition;