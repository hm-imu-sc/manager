import React, { useState } from "react";
import cssClasses from './InputRow.module.css';
import { setDefaultProps } from "../../../modules/Helpers";

export const inputTypes = {
    number: 'number',
    text: 'text',
    date: 'date',
    time: 'time',
    file: 'file',
    textarea: 'textarea'
};

export const defaultProps = {
    inputItems: []
};

const InputRow = (props) => {
    props = setDefaultProps(props, defaultProps);
    
    const [inputItems, setInputItems] = useState(props.inputItems);

    return (
        <div className={cssClasses.InputRow}>
            {
                inputItems.map((inputItem, idx) => {
                    const inputId = `${cssClasses.InputItem}_${idx}`;
                    const onChange = event => {
                        setInputItems(inputItems.map((v, i) => i === idx ? {type: v.type, label: v.label, value: event.target.value} : {...v}));
                        props.onChangeValue(props.rowIndex, idx, event.target.value);
                    }

                    return (
                        <div key={idx} className={cssClasses.InputItem}>
                            <label className={cssClasses.InputLabel} htmlFor={inputId}>{inputItem.label}:</label>
                            {
                                inputItem.type === inputTypes.textarea
                                ? <textarea id={inputId} rows="2" value={inputItem.value} onChange={onChange}></textarea>
                                : <input id={inputId} className={cssClasses.Input} type={inputItem.type} value={inputItem.value} onChange={onChange} />
                            }
                        </div>
                    );
                })
            }
        </div>
    );
}

export default InputRow;