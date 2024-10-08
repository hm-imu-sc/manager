import React from "react";
import cssClasses from "./Modal.module.css";

const Modal = (props) => {
    return (
        <React.Fragment>
            <div className={cssClasses.ModalBackground}>
                <div className={cssClasses.ModalRootDiv}>
                    <h1 className={cssClasses.Title}>{props.title}</h1>
                    <button className={cssClasses.CloseButton} onClick={() => props.setIsVisible(false)}>Close</button>
                    <hr className={cssClasses.Devider} />
                    {props.children}
                </div>
            </div>
        </React.Fragment>
    );
}

export default Modal;

