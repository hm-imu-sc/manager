import React, { useState } from "react";
import cssClasses from "./StudyMaterial.module.css";

const StudyMaterial = (props) => {
    const [isActiveState, setIsActiveState] = useState(false);

    return (
        <div className={cssClasses.RootDiv} onMouseEnter={() => setIsActiveState(true)} onMouseLeave={() => setIsActiveState(false)}>
            {props.title}
            <div className={[cssClasses.ActionDiv, isActiveState ? '' : cssClasses.Hide].join(' ')}>
                <button className={[cssClasses.Button, cssClasses.EditButton].join(' ')} onClick={props.editButtonOnClick}>Edit</button>
                <button className={[cssClasses.Button, cssClasses.DeleteButton].join(' ')} onClick={props.deleteButtonOnClick}>Delete</button>
                <button className={[cssClasses.Button].join(' ')} onClick={() => window.open(props.url, '_blank')}>Go</button>
            </div>
        </div>
    )
}

export default StudyMaterial;
