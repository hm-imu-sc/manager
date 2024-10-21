import React from "react";
import cssClasses from './DialogBox.module.css';
import { defaultCallBack } from "../../modules/DefaultValues";
import { setDefaultProps } from "../../modules/Helpers";

export const dialogBoxProps = {
    mode: '',
    content: '',
    cancelButtonText: '',
    confirmButtonText: '',
    cancelButtonOnClick: defaultCallBack,
    confirmButtonOnClick: defaultCallBack
}

// export const launchDialogBox = (config) => {
//     config.setModalState(updateProps(config.modalState, {
//         renderingMode: config.renderingMode,
//         title: config.title
//     }));
//     config.setDialogBoxState(updateProps(config.dialogBoxState, {
//         mode: config.dialogBoxMode,
//         content: config.content,
//         cancelButtonText: config.cancelButtonText,
//         cancelButtonOnClick: config.cancelButtonOnClick,
//         confirmButtonText: config.confirmButtonText,
//         confirmButtonOnClick: config.confirmButtonOnClick
//     }));
//     config.setIsModalVisible(true);
// }

const DialogBox = (props) => {
    props = setDefaultProps(props, dialogBoxProps);
    const cancelButtonText = (props.cancelButtonText === '' || props.cancelButtonText === null || props.cancelButtonText === undefined) ? 'Cancel' : props.cancelButtonText;
    const confirmationButtonText = (props.confirmButtonText === '' || props.confirmButtonText === null || props.confirmButtonText === undefined) ? 'Confirm' : props.confirmButtonText;

    return (
        <div className={cssClasses.DialogBoxRoot}>
            <div className={cssClasses.ContentDiv}>
                {props.content}
            </div>
            <div className={cssClasses.ActionDiv}>
                <button className={cssClasses.Button} onClick={props.cancelButtonOnClick}>{cancelButtonText}</button>
                {props.mode === 'confirmation' ?
                    <button className={cssClasses.Button} onClick={props.confirmButtonOnClick}>{confirmationButtonText}</button>
                : null}
            </div>
        </div>
    );
}

export default DialogBox;