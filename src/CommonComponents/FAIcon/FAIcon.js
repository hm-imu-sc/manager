import React, { useState } from "react"
import { setDefaultProps } from "../../modules/Helpers";

export const defaultProps = {
    iconClasses: ['far', 'fa-ban'],
    spinOnHover: false
}

const FAIcon = (props) => {
    props = setDefaultProps(props, defaultProps);
    const [isHover, setIsHover] = useState(false);
    const [isSpin, setIsSpin] = useState(props.spinOnHover);

    const mouseEnter = () => {
        setIsHover(true);
    }
    
    const mouseLeave = () => {
        setIsHover(false);
    }

    return (
        <i 
            className={`${props.iconClasses.join(" ")} ${(isHover && isSpin) ? 'fa-spin' : ''}`} 
            onMouseEnter={mouseEnter}
            onMouseLeave={mouseLeave} />
    );
}

export default FAIcon;