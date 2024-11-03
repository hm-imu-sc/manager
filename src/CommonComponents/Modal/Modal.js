import React, { useEffect, useRef } from "react";
import cssClasses from "./Modal.module.css";
import { setDefaultProps } from "../../modules/Helpers";  
import FAIcon from "../FAIcon/FAIcon";

export const modalModes = {
    mini: {
        rootDiv: cssClasses.MiniModal,
        contentDiv: cssClasses.MiniModalContentDiv,
        title: cssClasses.MiniModalTitle,
        closeButton: cssClasses.MiniModalCloseButton,
        closeButtonText: (<FAIcon iconClasses={['fas', 'fa-times', cssClasses.MiniModalCloseButtonIcon]} />)
    },
    medium: {
        rootDiv: cssClasses.MediumModal,
        contentDiv: cssClasses.MediumModalContentDiv,
        title: cssClasses.MediumModalTitle,
        closeButton: cssClasses.MediumModalCloseButton,
        closeButtonText: 'Close'
    },
    standard: {
        rootDiv: '',
        contentDiv: '',
        title: '',
        closeButton: '',
        closeButtonText: 'Close'
    },
    large: {
        rootDiv: cssClasses.LargeModal,
        contentDiv: cssClasses.LargeModalContentDiv,
        title: '',
        closeButton: '',
        closeButtonText: 'Close'
    }
}

export const defaultProps = {
    renderingMode: modalModes.standard,
    buttonSet: []
}

export const modalProps = {
    renderingMode: defaultProps.renderingMode,
    title: '',
    buttonSet: []
};  

const Modal = (props) => {
    props = setDefaultProps(props, defaultProps);
    const modalReference = useRef(null);

    // useEffect(() => {
    //     if (modalReference) {
    //         const { clientWidth, clientHeight } = modalReference.current;
    //         // modalReference.current.style.top = `calc(50% - ${clientHeight / 2}px)`;
    //         console.log("Height 2: ");
    //         console.log(modalReference.current.clientHeight);
    //         console.log(modalReference);
    //     }

    // }, [])

    return (
        <div className={cssClasses.ModalBackground}>
            <div ref={modalReference} className={[cssClasses.ModalRootDiv, props.renderingMode.rootDiv].join(' ')}>
                <div className={cssClasses.Header}>
                    <div className={[cssClasses.Title, props.renderingMode.title].join(' ')}>{props.title}</div>
                    <div className={cssClasses.ButtonSet}>
                        {
                            props.buttonSet.map((b, idx) => (
                                <button key={idx} className={[cssClasses.CloseButton].join(' ')} onClick={b.onClick}>{b.text}</button>
                            ))
                        }
                        <button className={[cssClasses.CloseButton, props.renderingMode.closeButton].join(' ')} onClick={() => props.setIsVisible(false)}>{props.renderingMode.closeButtonText}</button>
                    </div>
                </div>
                <hr className={cssClasses.Devider} />
                <div className={[cssClasses.ContentDiv, props.renderingMode.contentDiv].join(" ")}>
                    {props.children}    
                </div>
            </div>
        </div>
    );
}

export default Modal;

