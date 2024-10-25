import React, { useState } from "react";
import { setDefaultProps } from "../../../../modules/Helpers";
import cssClasses from "./Topic.module.css";
import FAIcon from "../../../../CommonComponents/FAIcon/FAIcon";

export const defaultProps = {
    name: 'Topic'
};

const Topic = (props) => {
    props = setDefaultProps(props, defaultProps);
    const [isIconSpin, setIsIconSpin] = useState(false);

    return (
        <div className={cssClasses.RootDiv}>
            <div className={cssClasses.Title}>
                <div className={cssClasses.Title}>Title</div>
                <button 
                    className={cssClasses.EditButton}
                    onMouseEnter={() => setIsIconSpin(true)}
                    onMouseLeave={() => setIsIconSpin(false)}>
                    <FAIcon iconClasses={["fad fa-cog", cssClasses.EditButtonIcon, isIconSpin ? 'fa-spin' : '']}/>
                </button>
            </div>
            <hr className={cssClasses.Divider} />
            <div className={cssClasses.StudyMaterials}>
                <div>Material 1</div>
                <div>Material 2</div>
                <div>Material 3</div>
                <div>Material 4</div>
                <div>Material 5</div>
            </div>
            <hr className={cssClasses.Divider} />
            <div className={cssClasses.Tags}>
                <div>Tag 1</div>
                <div>Tag 2</div>
                <div>Tag 3</div>
                <div>Tag 4</div>
            </div>
        </div>
    )
}

export default Topic;