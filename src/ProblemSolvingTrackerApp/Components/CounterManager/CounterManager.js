import React, { useEffect, useState, Fragment } from "react";
import cssClasses from "./CounterManager.module.css";
import Counter from "./Counter/Counter";
import { apiMethodTypes, fetchAPI } from "../../../modules/Fetcher";
import { CountService } from "../../modules/ProblemSolvingTrackerServices";
import { Datetime, updateProps } from "../../../modules/Helpers";
import Modal, {modalModes, modalProps} from "../../../CommonComponents/Modal/Modal";
import DialogBox from "../../../CommonComponents/DialogBox/DialogBox";
import FAIcon from "../../../CommonComponents/FAIcon/FAIcon";
import Calender from "../../../CommonComponents/Calender/Calender";
import { AdjustmentFlag, SummaryFlag } from "../../../modules/Constants";
import RenderOnCondition from "../../../CommonComponents/RenderOnCondition/RenderOnCondition";

export const counterModes = Object.freeze({
    topicCounter: 1,
    summary: 2,
    ojCounter: 3
});

const CounterManager = () => {
    const [mode, setMode] = useState(counterModes.topicCounter);
    const [previousDate, setPreviousDate] = useState(Datetime.today);
    const [currentDate, setCurrentDate] = useState(Datetime.today);
    const [refreshCounter, setRefreshCounter] = useState(1);
    const [countList, setCountList] = useState([]);
    const [countComponents, setCountComponents] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalState, setModalState] = useState({
        modalProps: modalProps,
        modalContent: null
    });

    const refresh = () => {
        setRefreshCounter(r => r + 1);
    }

    const updateCurrentDate = (newDate) => {
        setPreviousDate(currentDate);
        setCurrentDate(newDate);
    }

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
    
    const updateCount = (date, topicId, solveCount) => {
        setCountList(countList.map(count => {
            if (count.date === date && count.topicId === topicId) {
                const modifiedCount = {...count};
                modifiedCount.solveCount = (solveCount < 0 ? 0 : solveCount);
                return modifiedCount;
            }
            return count;
        }));
    }

    const saveChanges = async () => {
        const response = await fetchAPI(CountService.updateCounts, apiMethodTypes.PUT, {counts: countList})
        debugger;
        if (response.generalResponse.isSuccess) {
            refresh();
        }
        else {
            launchModal(modalModes.mini, "Failed !!!", (
                <DialogBox 
                    content={(<div dangerouslySetInnerHTML={{ __html: response.generalResponse.message }} />)} 
                    cancelButtonText="Close"
                    cancelButtonOnClick={() => setIsModalVisible(false)} />
                )
            );
        }
    }

    const dateOnSave = (date) => {
        updateCurrentDate(new Datetime({date: Datetime.extractDateParameter(date)}));
        setIsModalVisible(false);
    }

    const launchDatePicker = () => {
        launchModal(modalModes.medium, 'Jump to:', (
            <Calender date={currentDate.date} onSave={dateOnSave} />
        ));
    }

    const enableSummaryMode = () => {
        setMode(counterModes.summary);
        updateCurrentDate(new Datetime({date: Datetime.extractDateParameter(new Date(SummaryFlag))}));
    }
    
    const exitSummaryMode = () => {
        setMode(counterModes.topicCounter);
        updateCurrentDate(previousDate);
    }

    useEffect(() => {
        const action = async () => {
            const response = await fetchAPI(`${CountService.getAllCounts}/${currentDate.date}`, apiMethodTypes.GET);
            if (response.generalResponse.isSuccess) {
                setCountList(response.counts);
            }
            else {
                launchModal(modalModes.mini, "Failed !!!", (
                    <DialogBox 
                        content={response.generalResponse.message} 
                        cancelButtonText="Close"
                        cancelButtonOnClick={() => setIsModalVisible(false)} />
                    )
                );
            }
        }
        action();
    }, [refreshCounter, currentDate]);

    useEffect(() => {
        setCountComponents(countList.sort((c1, c2) => c1.topicName.localeCompare(c2.topicName)).map(count => (
            <Counter 
                key={`${count.date}_${count.topicId}`} 
                mode={mode}
                data={count}
                updateCount={updateCount} />
        )));
    }, [countList, mode]);

    return (
        <Fragment>
            <div className={cssClasses.RootDiv}>
                <div className={cssClasses.DateSection}>
                    <RenderOnCondition condition={mode === counterModes.topicCounter}>
                        <button className={[cssClasses.Button, cssClasses.DateShifterButton].join(' ')} onClick={() => updateCurrentDate(new Datetime({date: currentDate.dateParametes, offset: {days: -1}}))}>
                            <FAIcon iconClasses={["fad fa-chevron-left"]} />
                        </button>
                        <div className={cssClasses.Date} onClick={launchDatePicker}>
                            {`${Number.parseInt(currentDate.day)}`}<sup>{currentDate.daySuperscript}</sup>{` ${currentDate.monthName}, ${currentDate.year}`}
                        </div>
                        <button className={[cssClasses.Button, cssClasses.DateShifterButton].join(' ')} onClick={() => updateCurrentDate(new Datetime({date: currentDate.dateParametes, offset: {days: 1}}))}>
                            <FAIcon iconClasses={["fad fa-chevron-right"]} />
                        </button>
                    </RenderOnCondition>
                    <RenderOnCondition condition={mode === counterModes.summary}>
                        <div className={[cssClasses.Date, cssClasses.SummaryModeTitle].join(' ')}>
                            Topic Counter Summary
                        </div>
                    </RenderOnCondition>
                </div>
                <div className={[cssClasses.Panel, cssClasses.ActionPanel].join(' ')}>
                    <RenderOnCondition condition={mode === counterModes.topicCounter}>
                        <button className={cssClasses.Button} onClick={refresh}>Refresh</button>
                        <button className={cssClasses.Button} onClick={saveChanges}>Save Changes</button>
                        <button className={cssClasses.Button} onClick={() => updateCurrentDate(new Datetime({date: Datetime.extractDateParameter(new Date(AdjustmentFlag))}))}>Adjustment</button>
                        <button className={cssClasses.Button} onClick={enableSummaryMode}>Summary</button>
                    </RenderOnCondition>
                    <RenderOnCondition condition={mode === counterModes.summary}>
                        <button className={cssClasses.Button} onClick={exitSummaryMode}>Exit summary</button>
                    </RenderOnCondition>
                </div>
                <div className={[cssClasses.Panel, cssClasses.CounterList].join(' ')}>
                    {countComponents}
                </div>
            </div>
            <RenderOnCondition condition={isModalVisible}>
                <Modal renderingMode={modalState.modalProps.renderingMode} title={modalState.modalProps.title} setIsVisible={setIsModalVisible} >
                    {modalState.modalContent}
                </Modal>
            </RenderOnCondition>
        </Fragment>
    );
}

export default CounterManager;
