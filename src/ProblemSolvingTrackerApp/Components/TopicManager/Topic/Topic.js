import React, { useState, Fragment } from "react";
import { setDefaultProps } from "../../../../modules/Helpers";
import cssClasses from "./Topic.module.css";
import FAIcon from "../../../../CommonComponents/FAIcon/FAIcon";
import InputBox from "../../../../CommonComponents/InputBox/InputBox";
import Modal, { modalModes, modalProps } from "../../../../CommonComponents/Modal/Modal";
import { inputTypes } from "../../../../CommonComponents/InputBox/InputRow/InputRow";

export const defaultProps = {
    name: 'Topic'
};

const Topic = (props) => {
    props = setDefaultProps(props, defaultProps);
    const [isIconSpin, setIsIconSpin] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(props.openEditor);
    const [modalState, setModalState] = useState({
        modalProps: modalProps,
        modalContent: null
    });

    return (
        <Fragment>
            <div className={cssClasses.RootDiv}>
                <div className={cssClasses.TitleDiv}>
                    <div className={cssClasses.Title}>Topic name</div>
                    <button 
                        className={cssClasses.EditButton}
                        onMouseEnter={() => setIsIconSpin(true)}
                        onMouseLeave={() => setIsIconSpin(false)}
                        onClick={() => setIsModalVisible(true)}>
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
            {isModalVisible ? 
                <Modal renderingMode={modalModes.medium} title={modalState.modalProps.title} setIsVisible={setIsModalVisible}>
                    {/* {modalState.modalContent} */}
                    <InputBox inputRows={
                        [
                            [
                                {
                                    type: inputTypes.text,
                                    label: 'Topic name',
                                    value: 'Topic'
                                }
                            ],
                            [
                                {
                                    type: inputTypes.optionInput,
                                    label: 'Study materials',
                                    options: [
                                        {
                                            id: 1,
                                            name: "Material 1",
                                            isSelected: true
                                        },
                                        {
                                            id: 2,
                                            name: "Material 2",
                                            isSelected: false
                                        },
                                        {
                                            id: 3,
                                            name: "Material 3",
                                            isSelected: false
                                        },
                                        {
                                            id: 4,
                                            name: "Material 4",
                                            isSelected: true
                                        },
                                        {
                                            id: 5,
                                            name: "Material 5",
                                            isSelected: false
                                        }
                                    ]
                                }
                            ],
                            [
                                {
                                    type: inputTypes.optionInput,
                                    label: 'Tags',
                                    options: [
                                        {
                                            id: 1,
                                            name: "Tag 1",
                                            isSelected: true
                                        },
                                        {
                                            id: 2,
                                            name: "Tag 2",
                                            isSelected: true
                                        },
                                        {
                                            id: 3,
                                            name: "Tag 3",
                                            isSelected: false
                                        },
                                        {
                                            id: 4,
                                            name: "Tag 4",
                                            isSelected: false
                                        },
                                        {
                                            id: 5,
                                            name: "Tag 5",
                                            isSelected: true
                                        }
                                    ]
                                }
                            ]
                        ]
                    } />
                </Modal> 
            : null}
        </Fragment>
    )
}

export default Topic;