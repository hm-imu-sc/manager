import React, { useEffect, useState } from "react";
import { setDefaultProps } from "../../../modules/Helpers";
import RenderOnCondition from "../../RenderOnCondition/RenderOnCondition";
import cssClasses from "./Alert.module.css";
import FAIcon from "../../FAIcon/FAIcon";

const defaultProps = Object.freeze({
    message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem voluptatum placeat ducimus at minima, corporis distinctio delectus similique voluptates? Amet aperiam repellendus deserunt! Modi voluptatibus praesentium dolore nemo necessitatibus distinctio!',
    timeout: -1
});

const Alert = (props) => {
    props = setDefaultProps(props, defaultProps);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (props.timeout > 0) {
            setTimeout(() => setIsVisible(false), props.timeout);
        }
    }, []);

    return (
        <RenderOnCondition condition={isVisible}>
            <div className={cssClasses.RootDiv}>
                <div className={cssClasses.ContentDiv}>
                    {props.message}
                </div>
                <button className={cssClasses.CloseButton} onClick={() => setIsVisible(false)}>
                    <FAIcon iconClasses={["fas fa-times"]} />
                </button>
            </div>
        </RenderOnCondition>
    );
}

export default Alert;