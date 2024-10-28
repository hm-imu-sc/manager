import React, { useState, Fragment } from "react";
import { isEqual, setDefaultProps } from "../../../../modules/Helpers";
import cssClasses from "./Topic.module.css";
import FAIcon from "../../../../CommonComponents/FAIcon/FAIcon";
import InputBox from "../../../../CommonComponents/InputBox/InputBox";
import Modal, { modalModes, modalProps } from "../../../../CommonComponents/Modal/Modal";
import { inputTypes } from "../../../../CommonComponents/InputBox/InputRow/InputRow";
import { defaultCallBack } from "../../../../modules/DefaultValues";

export const topicRendetingMode = {
    display: 1,
    insert: 2
}

export const defaultProps = {
    renderingMode: topicRendetingMode.display,
    name: 'Topic',
    options: {}
};

const Topic = (props) => {
    props = setDefaultProps(props, defaultProps);

    const [topicData, setTopicData] = useState(props.topicData);
    const [allStudyMaterials, setAllStudyMaterials] = useState(props.allStudyMaterials);
    const [allTags, setAllTags] = useState(props.allTags);
    const [isActive, setIsActive] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(props.renderingMode === topicRendetingMode.insert);
    const [modalState, setModalState] = useState({
        modalProps: modalProps,
        modalContent: null
    });

    return (
        <Fragment>
            <div
                onMouseEnter={() => setIsActive(true)}
                onMouseLeave={() => setIsActive(false)}
                className={cssClasses.RootDiv}>
                <div className={[cssClasses.ActionDiv, isActive ? '' : cssClasses.Hide].join(' ')}>
                    <button 
                        className={cssClasses.EditButton}
                        onClick={() => setIsModalVisible(true)}>
                        <FAIcon iconClasses={["fad fa-cog", cssClasses.EditButtonIcon, isActive ? 'fa-spin' : '']}/>
                    </button>
                    <button 
                        className={cssClasses.EditButton}
                        onClick={() => props.deleteButtonOnClick(topicData)}>
                        <FAIcon iconClasses={["fad fa-eraser", cssClasses.EditButtonIcon]}/>
                    </button>
                </div>
                <div className={cssClasses.TitleDiv}>
                    <div className={cssClasses.Title}>{topicData.name}</div>
                </div>
                <hr className={cssClasses.Divider} />
                <div className={cssClasses.StudyMaterials}>
                    {
                        topicData.studyMaterials.map((sm, idx) => (
                            <div key={idx}>{ sm.title }</div>
                        ))
                    }
                </div>
                <hr className={cssClasses.Divider} />
                <div className={cssClasses.Tags}>
                    {
                        topicData.tags.map((t, idx) => (
                            <div key={idx}>{ t.name }</div>
                        ))
                    }
                </div>
            </div>
            {isModalVisible ? 
                <Modal renderingMode={modalModes.medium} title={props.renderingMode === topicRendetingMode.display ? "Edit topic:" : "Add topic:"} setIsVisible={(modalIsVisible) => {
                    setIsModalVisible(modalIsVisible);
                    if (props.renderingMode === topicRendetingMode.insert) {
                        topicData.addTopic({
                            isCancel: true
                        });
                    }
                }}>
                    <InputBox inputRows={
                        [
                            [
                                {
                                    type: inputTypes.text,
                                    label: 'Topic name',
                                    value: topicData.name
                                }
                            ],
                            [
                                {
                                    type: inputTypes.optionInput,
                                    label: 'Study materials',
                                    options: allStudyMaterials.map(sm => (
                                        {
                                            id: sm.id,
                                            name: sm.title,
                                            isSelected: topicData.studyMaterials.map(ssm => ssm.id).findIndex(id => id === sm.id) !== -1
                                        }
                                    ))
                                }
                            ],
                            [
                                {
                                    type: inputTypes.optionInput,
                                    label: 'Tags',
                                    options: allTags.map(t => (
                                        {
                                            id: t.id,
                                            name: t.name,
                                            isSelected: topicData.tags.map(tt => tt.id).findIndex(id => id === t.id) !== -1
                                        }
                                    ))
                                }
                            ]
                        ]
                    } 
                    cancelButtonOnClick={() => {
                        setIsModalVisible(false);
                        if (props.renderingMode === topicRendetingMode.insert) {
                            topicData.addTopic({
                                isCancel: true
                            });
                        }
                    }}
                    saveButtonOnClick={async (uniqueId, data, actionSet) => {
                        const newName = data[0][0].value;

                        const newStudyMaterials = [];
                        for (let sm of data[1][0].options) {
                            if (sm.isSelected) {
                                const idx = allStudyMaterials.map(ssm => ssm.id).findIndex(id => id === sm.id);
                                newStudyMaterials.push({...allStudyMaterials[idx]});
                            }
                        }
                        const newTags = [];
                        for (let t of data[2][0].options) {
                            if (t.isSelected) {
                                const idx = allTags.map(tt => tt.id).findIndex(id => id === t.id);
                                newTags.push({...allTags[idx]});
                            }
                        }

                        if (newName !== topicData.name 
                            || !isEqual(topicData.studyMaterials.map(sm => sm.id), newStudyMaterials.map(sm => sm.id))
                            || !isEqual(topicData.tags.map(t => t.id), newTags.map(t => t.id))) {
                            const newTopicData = {
                                id: topicData.id,
                                name: newName,
                                studyMaterials: newStudyMaterials,
                                tags: newTags
                            };

                            let isSuccess = true;
                            let message = '';

                            if (props.renderingMode === topicRendetingMode.insert) {
                                [isSuccess, message] = await topicData.addTopic({
                                    isCancel: false,
                                    topicData: newTopicData
                                });
                            }
                            else {
                                [isSuccess, message] = await props.saveButtonOnClick(newTopicData);
                            }

                            if (isSuccess) {
                                setIsModalVisible(false);
                                setTopicData(newTopicData);
                            }
                            else {
                                actionSet.failedAction(message);
                            }

                        }
                    }}/>
                </Modal> 
            : null}
        </Fragment>
    )
}

export default Topic;