import React, { useState } from "react";
import cssClasses from "./Tag.module.css";
import FAIcon from "../../../../CommonComponents/FAIcon/FAIcon";

const Tag = (props) => {
    const [isActiveState, setIsActiveState] = useState(false);

    return (
        <div onMouseEnter={() => setIsActiveState(true)} onMouseLeave={() => setIsActiveState(false)} className={cssClasses.Tag}>
            {props.name}
            <div className={[cssClasses.ActionDiv, isActiveState ? '' : cssClasses.Hide].join(' ')}>
                <button className={[cssClasses.Button, cssClasses.EditButton].join(' ')} onClick={props.editButtonOnClick}>
                    <FAIcon iconClasses={["fad fa-pencil-alt"]} />
                </button>
                <button className={[cssClasses.Button, cssClasses.DeleteButton].join(' ')} onClick={props.deleteButtonOnClick}>
                    <FAIcon iconClasses={["fad fa-trash-alt"]} />
                </button>
            </div>
        </div>
    );
}

export default Tag;