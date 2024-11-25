import React, { useState, Fragment } from "react";
import cssClasses from "./Counter.module.css";
import FAIcon from "../../../../CommonComponents/FAIcon/FAIcon";
import Modal, {modalModes, modalProps} from "../../../../CommonComponents/Modal/Modal";
import { setDefaultProps, updateProps } from "../../../../modules/Helpers";
import InputBox from "../../../../CommonComponents/InputBox/InputBox";
import { inputTypes } from "../../../../CommonComponents/InputBox/InputRow/InputRow";
import RenderOnCondition from "../../../../CommonComponents/RenderOnCondition/RenderOnCondition";
import { counterModes } from "../CounterManager";


export const counterViewMode = Object.freeze({
    showAll: 1,
    showSolved: 2,
    showUnsolved: 3
});

const defaultProps = Object.freeze({
    viewMode: counterViewMode.showAll
});

const Counter = (props) => {

    props = setDefaultProps(props, defaultProps);

    const [isActive, setIsActive] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalState, setModalState] = useState({
        modalProps: modalProps,
        modalContent: null
    });

    const launchModal = (renderingMode, title, content) => {
        setModalState(updateProps(modalState, {
            modalProps: {
                renderingMode: renderingMode,
                title: title
            },
            modalContent: content
        }));
        setIsModalVisible(true);
    }

    const launchCounterEditor = () => {
        launchModal(modalModes.mini, `${props.data.date}: ${props.data.topicName}`, (
            <InputBox inputRows={[
                [
                    {
                        type: inputTypes.number,
                        label: 'Solve count',
                        value: props.data.solveCount
                    }
                ]
            ]} 
            cancelButtonOnClick={() => setIsModalVisible(false)}
            saveButtonOnClick={(uniqueId, data, actionSet) => {
                props.updateCount(props.data.date, props.data.topicId, Number.parseInt(data[0][0].value));
                setIsModalVisible(false);
            }}/>
        ));
    }

    const highlightIfSolved = () => {
        return props.data.solveCount > 0 ? cssClasses.Solved : '';
    }

    const hideIfInactive = () => {
        return isActive ? '' : cssClasses.Hidden;
    }

    return (
        <RenderOnCondition condition={
            (props.data.solveCount > 0 && props.viewMode === counterViewMode.showSolved)
            || (props.data.solveCount === 0 && props.viewMode === counterViewMode.showUnsolved)
            || props.viewMode === counterViewMode.showAll
        }>
            <Fragment>
                <div className={cssClasses.RootDiv} onMouseEnter={() => setIsActive(true)} onMouseLeave={() => setIsActive(false)}>
                    <RenderOnCondition condition={props.mode !== counterModes.summary}>
                        <button className={[cssClasses.Button, cssClasses.MinusButton, hideIfInactive(), highlightIfSolved()].join(" ")} onClick={() => props.updateCount(props.data.date, props.data.topicId, props.data.solveCount - 1)}>
                            <FAIcon iconClasses={["fas fa-minus"]} />
                        </button>
                        <button className={[cssClasses.Button, cssClasses.PlusButton, hideIfInactive(), highlightIfSolved()].join(" ")} onClick={() => props.updateCount(props.data.date, props.data.topicId, props.data.solveCount + 1)}>
                            <FAIcon iconClasses={["fas fa-plus"]} />
                        </button>
                        <div className={[cssClasses.TopicCount, highlightIfSolved()].join(' ')} onClick={launchCounterEditor}>
                            <div className={cssClasses.Count}>{props.data.solveCount}</div>
                            <hr className={[cssClasses.Divider, highlightIfSolved()].join(' ')} />
                            <div className={cssClasses.TopicName}>{props.data.topicName}</div>
                        </div>
                    </RenderOnCondition>
                    <RenderOnCondition condition={props.mode === counterModes.summary}>
                        <div className={[cssClasses.TopicCount, highlightIfSolved()].join(' ')}>
                            <div className={cssClasses.Count}>{props.data.solveCount}</div>
                            <hr className={[cssClasses.Divider, highlightIfSolved()].join(' ')} />
                            <div className={cssClasses.TopicName}>{props.data.topicName}</div>
                        </div>
                    </RenderOnCondition>
                </div>
                <RenderOnCondition condition={isModalVisible}>
                    <Modal renderingMode={modalState.modalProps.renderingMode} title={modalState.modalProps.title} setIsVisible={setIsModalVisible} >
                        {modalState.modalContent}
                    </Modal>
                </RenderOnCondition>
            </Fragment>
        </RenderOnCondition>
    );
}

export default Counter;