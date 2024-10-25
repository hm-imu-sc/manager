import React, { useState, Fragment } from "react";
import cssClasses from './InputRow.module.css';
import { setDefaultProps, updateProps } from "../../../modules/Helpers";
import FAIcon from "../../FAIcon/FAIcon";
import Modal, { modalModes, modalProps } from "../../Modal/Modal";
import OptionInput from "./OptionInput/OptionInput";

export const inputTypes = {
    number: 'number',
    text: 'text',
    date: 'date',
    time: 'time',
    file: 'file',
    textarea: 'textarea',
    optionInput: 'optionInput'
};

export const defaultProps = {
    inputItems: []
};

const InputRow = (props) => {
    props = setDefaultProps(props, defaultProps);
    const [inputItems, setInputItems] = useState(props.inputItems);
    const [isModalVisible, setIsModalVisible] = useState(props.openEditor);
    const [modalState, setModalState] = useState({
        modalProps: modalProps,
        modalContent: null
    });


    return (
        <Fragment>
            <div className={cssClasses.InputRow}>
                {
                    inputItems.map((inputItem, idx) => {
                        const inputId = `${cssClasses.InputItem}_${idx}`;
                        
                        const onValueChange = event => {
                            setInputItems(inputItems.map((v, i) => i === idx ? {type: v.type, label: v.label, value: event.target.value} : {...v}));
                            props.onChangeValue(props.rowIndex, idx, event.target.value);
                        }

                        const openOptions = (options, title) => {
                            setModalState(updateProps(modalState, {
                                modalProps: {
                                    renderingMode: modalModes.mini,
                                    title: title
                                },
                                modalContent: (
                                    <OptionInput options={options} cancelButtonOnClick={() => setIsModalVisible(false)} saveButtonOnClick={updatedOptions => {
                                        setInputItems(inputItems.map((v, i) => i === idx ? {type: v.type, label: v.label, options: updatedOptions} : {...v}));
                                        setIsModalVisible(false);
                                    }} />
                                )
                            }));
                            setIsModalVisible(true);
                        }

                        let inputComponent = null;
                        
                        if (inputItem.type === inputTypes.optionInput) {
                            inputComponent = (
                                <div className={[cssClasses.Input, cssClasses.OptionInput].join(" ")}>
                                    <div className={cssClasses.Options}>
                                        {
                                            inputItem.options.map(o => o.isSelected ? (<div className={cssClasses.Option}>{o.name}</div>) : null)
                                        }
                                    </div>
                                    <button className={cssClasses.EditButton} onClick={() => openOptions(inputItem.options, `Select ${inputItem.label}:`)}>
                                        <FAIcon iconClasses={["fas fa-plus"]} />
                                    </button>
                                </div>
                            );
                        }
                        else if (inputItem.type === inputTypes.textarea) {
                            inputComponent = (<textarea id={inputId} className={cssClasses.Input} rows="2" value={inputItem.value} onChange={onValueChange}></textarea>);
                        }
                        else {
                            inputComponent = (<input id={inputId} className={cssClasses.Input} type={inputItem.type} value={inputItem.value} onChange={onValueChange} />);
                        }

                        return (
                            <div key={idx} className={cssClasses.InputItem}>
                                <label className={cssClasses.InputLabel} htmlFor={inputId}>{inputItem.label}:</label>
                                {inputComponent}
                            </div>
                        );
                    })
                }
            </div>
            {isModalVisible ?
                <Modal renderingMode={modalState.modalProps.renderingMode} title={modalState.modalProps.title} setIsVisible={setIsModalVisible} >
                    {modalState.modalContent}
                </Modal>
            : null}
        </Fragment>
    );
}

export default InputRow;