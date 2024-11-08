import React, { Fragment, useState } from "react";
import cssClasses from "./Calender.module.css";
import Modal, { modalProps, modalModes } from "../Modal/Modal";

const Calender = (props) => {
    const [selectedDate, setSelectedDate] = useState(props.date)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalState, setModalState] = useState({
        modalProps: modalProps,
        modalContent: null
    });

    return (
        <Fragment>
            <div className={cssClasses.RootDiv}>
                <input className={cssClasses.DateField} type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                <button className={cssClasses.Button} onClick={() => props.onSave(new Date(selectedDate))}>Save</button>
            </div>
            {isModalVisible ?
                <Modal renderingMode={modalState.modalProps.renderingMode} title={modalState.modalProps.title} setIsVisible={setIsModalVisible} >
                    {modalState.modalContent}
                </Modal>
            : null}
        </Fragment>
    );
}

export default Calender;