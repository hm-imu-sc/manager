import React, { useState } from "react";
import cssClasses from './ProblemSolvingTrackerApp.module.css';
import Modal, { modalModes, modalProps } from "../CommonComponents/Modal/Modal.js";
import TagManager, { TagManagerTitle } from "./Components/TagManager/TagManager.js";
import { updateProps } from "../modules/Helpers";
import TopicManager, { TopicManagerTitle } from "./Components/TopicManager/TopicManager";
import StudyMaterialManager, { StudyMaterialManagerTitle } from "./Components/StudyMaterialManager/StudyMaterialManager";

const Tracker = () => {
    const [isModalVisible, setIsModalVisible] = useState(true);
    const [modalState, setModalState] = useState({
        modalProps: modalProps,
        modalContent: (<TopicManager />)
    });

    const modalLauncher = (renderingMode, title, content) => {
        setModalState(updateProps(modalState, {
            modalProps: {
                renderingMode: renderingMode,
                title: title
            },
            modalContent: content
        }));
        setIsModalVisible(true);
    }

    return (
        <div className={cssClasses.Root}>
            <div className={cssClasses.LoaderDiv}>
                <button className={cssClasses.Loader} onClick={() => modalLauncher(modalModes.medium, TagManagerTitle, (<TagManager />))}>Tag Manager</button>
                <button className={cssClasses.Loader} onClick={() => modalLauncher(modalModes.standard, TopicManagerTitle, (<TopicManager />))}>Topic Manager</button>
                <button className={cssClasses.Loader} onClick={() => modalLauncher(modalModes.medium, StudyMaterialManagerTitle, (<StudyMaterialManager />))}>Study Material Manager</button>
            </div>

            {isModalVisible ? 
                <Modal renderingMode={modalState.modalProps.renderingMode} title={modalState.modalProps.title} setIsVisible={setIsModalVisible}>
                    {modalState.modalContent}
                </Modal> 
            : null}
        </div>
    );
}

export default Tracker;
