import React, { useState } from "react";
import cssClasses from './ProblemSolvingTrackerApp.module.css';
import Modal, { modalModes, modalProps } from "../CommonComponents/Modal/Modal.js";
import TagManager, { TagManagerTitle } from "./Components/TagManager/TagManager.js";
import { updateProps } from "../modules/Helpers";
import TopicManager, { TopicManagerTitle } from "./Components/TopicManager/TopicManager";
import StudyMaterialManager, { StudyMaterialManagerTitle } from "./Components/StudyMaterialManager/StudyMaterialManager";
import FAIcon from "../CommonComponents/FAIcon/FAIcon.js";
import CounterManager from "./Components/CounterManager/CounterManager";

const Tracker = () => {
    const [refreshCounter, setRefreshCounter] = useState(1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalState, setModalState] = useState({
        modalProps: modalProps,
        modalContent: null
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

    const refreshModalContent = () => {
        setRefreshCounter(r => r + 1);
    }

    return (
        <div className={cssClasses.Root}>

            <CounterManager />

            <div className={cssClasses.LoaderDiv}>
                <button className={[cssClasses.Loader, cssClasses.SettingsButton].join(" ")} onClick={() => setIsModalVisible(true)}>
                    <FAIcon iconClasses={["fad fa-cog"]} />
                </button>
            </div>
            {isModalVisible ? 
                <Modal 
                    key={refreshCounter} 
                    renderingMode={modalModes.large} 
                    title={"Settings"} setIsVisible={setIsModalVisible}
                    buttonSet={[{text: "Refresh", onClick: refreshModalContent}]}>
                    <div className={cssClasses.SectionTitle}>Tags:</div>
                    <TagManager />
                    <hr className={cssClasses.Divider}/>
                    <div className={cssClasses.SectionTitle}>Study materials:</div>
                    <StudyMaterialManager />
                    <hr className={cssClasses.Divider} />
                    <div className={cssClasses.SectionTitle}>Topics:</div>
                    <TopicManager />
                </Modal> 
            : null}
        </div>
    );
}

export default Tracker;
