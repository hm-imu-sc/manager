import React from "react";
import cssClasses from "./RadioGroup.module.css";
import { setDefaultProps } from "../../modules/Helpers";
import RenderOnCondition from "../RenderOnCondition/RenderOnCondition";
import FAIcon from "../FAIcon/FAIcon";

const defaultProps = Object.freeze({
    options: [],
    name: '',
    title: '',
    checked: null
});

const RadioGroup = (props) => {
    props = setDefaultProps(props, defaultProps);

    return (
        <RenderOnCondition condition={props.options.length > 0}>
            <div className={[cssClasses.RedioGroup].join(' ')}>
                <div className={cssClasses.Title}>
                    {props.title}
                </div>
                {
                    props.options.map((option, idx) => (
                        <label key={`${option.label}_${idx}`} htmlFor={option.label}>
                            <input name={props.name} id={option.label} type="radio" onChange={() => props.onChange(option.value)} checked={props.checkedOption === option.value} />
                            <RenderOnCondition condition={props.checkedOption === option.value}>
                                <div className={cssClasses.Tick}><FAIcon iconClasses={["fad fa-check"]} /></div>
                            </RenderOnCondition>
                            <div className={[cssClasses.Label, (props.checkedOption === option.value) ? cssClasses.Active : ' '].join(' ')}>{option.label}</div>
                        </label>
                    ))
                }
            </div>
        </RenderOnCondition>
    );
}

export default RadioGroup;