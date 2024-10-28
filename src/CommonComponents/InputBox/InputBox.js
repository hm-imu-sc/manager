import React, { Fragment, useState } from "react";
import cssClasses from './InputBox.module.css';
import InputRow, { inputTypes } from "./InputRow/InputRow";
import { setDefaultProps } from "../../modules/Helpers";
import { defaultCallBack } from "../../modules/DefaultValues";
import DialogBox from "../DialogBox/DialogBox";
import Modal, { modalModes, modalProps } from "../Modal/Modal";

export const defaultProps = {
    uniqueId: -1,
    inputRows: [],
    cancelButtonOnClick: defaultCallBack,
    cancelButtonText: 'Cancel',
    saveButtonOnClick: defaultCallBack,
    saveButtonText: 'Save'
};

const InputBox = (props) => {    
    props = setDefaultProps(props, defaultProps);
    
    const [data, setData] = useState(props.inputRows);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalState, setModalState] = useState({
        modalProps: modalProps,
        modalContent: []
    });

    return (
        <Fragment>
            <div className={cssClasses.ContentDiv}>
                {
                    data.map((inputItems, idx) => {
                        return (
                            <InputRow 
                                key={idx} 
                                rowIndex={idx}
                                inputItems={inputItems}
                                onChangeValue={(row, column, v) => {
                                    const modifiedValue = data.map(d => d.map(dd => ({...dd})));
                                    if (modifiedValue[row][column].type === inputTypes.optionInput) {
                                        modifiedValue[row][column].options = v; 
                                    }
                                    else {
                                        modifiedValue[row][column].value = v; 
                                    }
                                    setData(modifiedValue);
                                }} />
                        );
                    })
                }
            </div>
            <div className={cssClasses.ActionDiv}>
                <button className={cssClasses.Button} onClick={props.cancelButtonOnClick}>{props.cancelButtonText}</button>
                <button className={cssClasses.Button} onClick={() => {
                    props.saveButtonOnClick(props.uniqueId, data, {failedAction: message => {
                        setModalState({
                            modalProps: {
                                renderingMode: modalModes.mini,
                                title: "Failed !"
                            },
                            modalContent: (
                                <DialogBox 
                                    content={message}
                                    cancelButtonText="Close"
                                    cancelButtonOnClick={() => {
                                        setIsModalVisible(false);
                                    }} />
                            )
                        })
                        setIsModalVisible(true);
                    }})
                }}>{props.saveButtonText}</button>
            </div>
            {isModalVisible ?
                <Modal renderingMode={modalState.modalProps.renderingMode} title={modalState.modalProps.title} setIsVisible={setIsModalVisible} >
                    {modalState.modalContent}
                </Modal>
            : null}
        </Fragment>
    );
}

export default InputBox;
