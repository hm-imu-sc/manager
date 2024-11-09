import React, { useEffect, useState, Fragment, useContext } from "react";
import cssClasses from "./CounterManager.module.css";
import Counter from "./Counter/Counter";
import { apiMethodTypes, fetchAPI } from "../../../modules/Fetcher";
import { CountService } from "../../modules/ProblemSolvingTrackerServices";
import { Datetime, updateProps } from "../../../modules/Helpers";
import Modal, {modalModes, modalProps} from "../../../CommonComponents/Modal/Modal";
import DialogBox from "../../../CommonComponents/DialogBox/DialogBox";
import FAIcon from "../../../CommonComponents/FAIcon/FAIcon";
import Calender from "../../../CommonComponents/Calender/Calender";
import { AdjustmentFlag, OnlineJudgeFlag, SummaryFlag } from "../../../modules/Constants";
import RenderOnCondition from "../../../CommonComponents/RenderOnCondition/RenderOnCondition";
import AlertListContext from "../../../Context/AlertListContext";
import { defaultCallBack } from "../../../modules/DefaultValues";

export const counterModes = Object.freeze({
    topicCounter: 1,
    ojCounter: 2,
    summary: 3,
    adjustment: 4
});

const CounterManager = () => {
    /**
     * define states
     */
    const [modeDateStack, setModeDateStack] = useState([]);
    const [mode, setMode] = useState(counterModes.topicCounter);
    const [currentDate, setCurrentDate] = useState(Datetime.today);
    const [refreshCounter, setRefreshCounter] = useState(1);
    const [countList, setCountList] = useState([]);
    const [countComponents, setCountComponents] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalState, setModalState] = useState({
        modalProps: modalProps,
        modalContent: null
    });
    
    const alert = useContext(AlertListContext);

    const refresh = () => {
        alert.pushAlert('All counters has been reloaded.', 2000);
        setRefreshCounter(r => r + 1);
    }

    const updateModeDateStack = () => {
        setModeDateStack(s => [...s.map(ss => ({...ss})), {mode: mode, date: currentDate}]);
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
        if (response.generalResponse.isSuccess) {
            alert.pushAlert('All changes are save successfully.', 3000);
            refresh();
        }
        else {
            alert.pushAlert('Failed to save some of the changes. Check console log for details.', 3000);
            console.log(response.generalResponse.message);
        }
    }

    const launchDatePicker = () => {
        launchModal(modalModes.medium, 'Jump to:', (
            <Calender date={currentDate.date} onSave={date => {
                setCurrentDate(new Datetime({date: Datetime.extractDateParameter(date)}));
                setIsModalVisible(false);
            }} />
        ));
    }

    const changeMode = (newMode, date) => {
        if (newMode === counterModes.topicCounter) {
            setModeDateStack([]);
        }
        else {
            updateModeDateStack();
        }
        setMode(newMode);
        setCurrentDate(new Datetime({date: Datetime.extractDateParameter(new Date(date))}));
    }

    const exitToPreviousMode = () => {
        if (modeDateStack.length > 0) {
            setModeDateStack(s => {
                const modifiedStack = s.map(ss => ({...ss}));
                const lastMode = modifiedStack.pop();
    
                setMode(lastMode.mode);
                setCurrentDate(lastMode.date);

                return modifiedStack;
            });
        }
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
                        <button className={[cssClasses.Button, cssClasses.DateShifterButton].join(' ')} onClick={() => setCurrentDate(new Datetime({date: currentDate.dateParametes, offset: {days: -1}}))}>
                            <FAIcon iconClasses={["fad fa-chevron-left"]} />
                        </button>
                        <div className={cssClasses.Date} onClick={launchDatePicker}>
                            {`${Number.parseInt(currentDate.day)}`}<sup>{currentDate.daySuperscript}</sup>{` ${currentDate.monthName}, ${currentDate.year}`}
                        </div>
                        <button className={[cssClasses.Button, cssClasses.DateShifterButton].join(' ')} onClick={() => setCurrentDate(new Datetime({date: currentDate.dateParametes, offset: {days: 1}}))}>
                            <FAIcon iconClasses={["fad fa-chevron-right"]} />
                        </button>
                    </RenderOnCondition>
                    <RenderOnCondition condition={mode === counterModes.summary}>
                        <div className={[cssClasses.Date, cssClasses.TitleOnly].join(' ')}>
                            Topic Counter Summary
                        </div>
                    </RenderOnCondition>
                    <RenderOnCondition condition={mode === counterModes.adjustment}>
                        <div className={[cssClasses.Date, cssClasses.TitleOnly].join(' ')}>
                            Counter Adjustments
                        </div>
                    </RenderOnCondition>
                    <RenderOnCondition condition={mode === counterModes.ojCounter}>
                        <div className={[cssClasses.Date, cssClasses.TitleOnly].join(' ')}>
                            Total Solved: {countList.reduce((sum, count) => sum += count.solveCount, 0)}
                        </div>
                    </RenderOnCondition>
                </div>
                <div className={[cssClasses.Panel, cssClasses.ActionPanel].join(' ')}>
                    <RenderOnCondition condition={modeDateStack.length > 0}>
                        <button className={[cssClasses.Button, cssClasses.BackButton].join(' ')} onClick={exitToPreviousMode}>
                            <FAIcon iconClasses={['fad fa-arrow-left']} />
                        </button>
                    </RenderOnCondition>

                    <button className={cssClasses.Button} onClick={refresh}>Refresh</button>
                    
                    <RenderOnCondition condition={mode !== counterModes.summary}>
                        <button className={cssClasses.Button} onClick={saveChanges}>Save Changes</button>
                        <button className={cssClasses.Button} onClick={() => changeMode(counterModes.summary, SummaryFlag)}>Show Summary</button>
                    </RenderOnCondition>

                    <RenderOnCondition condition={mode !== counterModes.adjustment}>
                        <button className={cssClasses.Button} onClick={() => changeMode(counterModes.adjustment, AdjustmentFlag)}>Adjustments</button>
                    </RenderOnCondition>
                    
                    <RenderOnCondition condition={mode !== counterModes.ojCounter}>
                        <button className={cssClasses.Button} onClick={() => changeMode(counterModes.ojCounter, OnlineJudgeFlag)}>Online Judje Counter</button>
                    </RenderOnCondition>

                    <RenderOnCondition condition={mode !== counterModes.topicCounter}>
                        <button className={cssClasses.Button} onClick={() => changeMode(counterModes.topicCounter, Datetime.today.date)}>Topic Counter</button>
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
