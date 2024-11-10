import React, { useContext, useState } from "react";
import cssClasses from './ProblemSolvingTrackerApp.module.css';
import Modal, { modalModes, modalProps } from "../CommonComponents/Modal/Modal.js";
import TagManager, { TagManagerTitle } from "./Components/TagManager/TagManager.js";
import { updateProps } from "../modules/Helpers";
import TopicManager, { TopicManagerTitle } from "./Components/TopicManager/TopicManager";
import StudyMaterialManager, { StudyMaterialManagerTitle } from "./Components/StudyMaterialManager/StudyMaterialManager";
import FAIcon from "../CommonComponents/FAIcon/FAIcon.js";
import CounterManager from "./Components/CounterManager/CounterManager";
import RenderOnCondition from "../CommonComponents/RenderOnCondition/RenderOnCondition";
import AlertBox from "../CommonComponents/AlertBox/AlertBox";
import AlertListContext from "../Context/AlertListContext";
import { Link } from 'react-router-dom';

const Tracker = () => {
    const [refreshCounter, setRefreshCounter] = useState(1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalState, setModalState] = useState({
        modalProps: modalProps,
        modalContent: null
    });

    const alert = useContext(AlertListContext);

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

    const refresh = () => {
        setRefreshCounter(r => r + 1);
        alert.pushAlert("Settings reloaded.", 2000);
    }

    return (
        <div className={cssClasses.Root}>
            <CounterManager />
            <div className={cssClasses.LoaderDiv}>
                <button className={[cssClasses.Loader, cssClasses.SettingsButton].join(" ")} onClick={() => setIsModalVisible(true)}>
                    <FAIcon iconClasses={["fad fa-cog"]} />
                </button>
                <Link className={[cssClasses.Loader, cssClasses.AppBrowser].join(" ")} to="/">
                    <FAIcon iconClasses={['fad fa-arrow-left']} />
                </Link>
                
            </div>
            <AlertBox />
            <RenderOnCondition condition={isModalVisible}>
                <Modal 
                    key={refreshCounter} 
                    renderingMode={modalModes.large} 
                    title={"Settings"} setIsVisible={setIsModalVisible}
                    buttonSet={[{text: "Refresh", onClick: refresh}]}>
                    <div className={cssClasses.SectionTitle}>Tags:</div>
                    <TagManager />
                    <hr className={cssClasses.Divider}/>
                    <div className={cssClasses.SectionTitle}>Study materials:</div>
                    <StudyMaterialManager />
                    <hr className={cssClasses.Divider} />
                    <div className={cssClasses.SectionTitle}>Topics:</div>
                    <TopicManager />
                </Modal> 
            </RenderOnCondition>
        </div>
    );
}

export default Tracker;
