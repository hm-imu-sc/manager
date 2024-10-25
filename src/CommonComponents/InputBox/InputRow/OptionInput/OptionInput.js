import React, { useState, Fragment } from "react";
import cssClasses from "./OptionInput.module.css";

const OptionInput = (props) => {
    const [options, setOptions] = useState(props.options);

    const toggleOption = id => {
        setOptions(options.map(o => o.id === id ? {id: id, name: o.name, isSelected: !o.isSelected} : {...o}));
    }

    return (
        <Fragment>
            <div className={cssClasses.RootDiv}>
                {
                    options.map(o => (
                        <button 
                            className={[cssClasses.Option, o.isSelected ? cssClasses.SelectedOption : ""].join(" ")}
                            onClick={() => toggleOption(o.id)}>
                            {o.name}
                        </button>
                    ))
                }
            </div>
            <hr className={cssClasses.Divider} />
            <div className={cssClasses.ActionDiv}>
                <button className={cssClasses.ActionButton} onClick={props.cancelButtonOnClick}>Cancel</button>
                <button className={cssClasses.ActionButton} onClick={() => props.saveButtonOnClick(options)}>Save</button>
            </div>
        </Fragment>
    )
}


export default OptionInput;
