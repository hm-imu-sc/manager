import React from "react";
import cssClasses from "./Modal.module.css";
import { setDefaultProps } from "../../modules/Helpers";  

export const modalModes = {
    mini: {
        rootDiv: cssClasses.MiniModal,
        title: cssClasses.MiniModalTitle,
        closeButton: cssClasses.MiniModalCloseButton,
        closeButtonText: 'X'
    },
    medium: {
        rootDiv: cssClasses.MediumModal,
        title: cssClasses.MediumModalTitle,
        closeButton: '',
        closeButtonText: 'Close'
    },
    standard: {
        rootDiv: '',
        title: '',
        closeButton: '',
        closeButtonText: 'Close'
    },
    large: {
        rootDiv: cssClasses.LargeModal,
        title: '',
        closeButton: '',
        closeButtonText: 'Close'
    }
}

export const defaultProps = {
    renderingMode: modalModes.standard
}

export const modalProps = {
    renderingMode: defaultProps.renderingMode,
    title: ''
};  

const Modal = (props) => {
    props = setDefaultProps(props, defaultProps);

    return (
        <div className={cssClasses.ModalBackground}>
            <div className={[cssClasses.ModalRootDiv, props.renderingMode.rootDiv].join(' ')}>
                <h1 className={[cssClasses.Title, props.renderingMode.title].join(' ')}>{props.title}</h1>
                <button className={[cssClasses.CloseButton, props.renderingMode.closeButton].join(' ')} onClick={() => props.setIsVisible(false)}>{props.renderingMode.closeButtonText}</button>
                <hr className={cssClasses.Devider} />
                {props.children}
            </div>
        </div>
    );
}

export default Modal;

