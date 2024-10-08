import React from "react";
import cssClasses from "./Tag.module.css";

const Tag = (props) => {
    return (
        <div onMouseOver={() => console.log("hover !!!")} className={cssClasses.tag}>{props.name}</div>
    );
}

export default Tag;