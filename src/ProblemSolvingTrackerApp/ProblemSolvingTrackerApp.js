import React, { useState } from "react";
import Tag from './Components/TagManager/Tag/Tag.js';
import cssClasses from './ProblemSolvingTrackerApp.module.css';
import Modal, { modalModes } from "../CommonComponents/Modal/Modal.js";
import TagManager, { TagManagerTitle } from "./Components/TagManager/TagManager.js";

const Tracker = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    return (
        <div className={cssClasses.Root}>
            <button className={cssClasses.Loader} onClick={() => setIsModalVisible(true)}>Tag Manager</button>

            {isModalVisible ? 
                <Modal renderingMode={modalModes.standard} title={TagManagerTitle} setIsVisible={setIsModalVisible}>
                    <TagManager />
                </Modal> 
            : null}
        </div>
    );
}

export default Tracker;
