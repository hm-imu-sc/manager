import React, { useEffect, useState, Fragment, useContext } from "react";
import cssClasses from "./CounterManager.module.css";
import Counter, { counterViewMode } from "./Counter/Counter";
import { apiMethodTypes, fetchAPI } from "../../../modules/Fetcher";
import { CountService } from "../../modules/ProblemSolvingTrackerServices";
import { Datetime, isNullOrEmpty, updateProps } from "../../../modules/Helpers";
import Modal, {modalModes, modalProps} from "../../../CommonComponents/Modal/Modal";
import DialogBox from "../../../CommonComponents/DialogBox/DialogBox";
import FAIcon from "../../../CommonComponents/FAIcon/FAIcon";
import Calender from "../../../CommonComponents/Calender/Calender";
import { AdjustmentFlag, OnlineJudgeFlag, SummaryFlag } from "../../../modules/Constants";
import RenderOnCondition from "../../../CommonComponents/RenderOnCondition/RenderOnCondition";
import AlertListContext from "../../../Context/AlertListContext";
import TabBar from "../../../CommonComponents/TabBar/TabBar";
import RadioGroup from "../../../CommonComponents/RadioGroup/RadioGroup";
import ToggleSwitch from "../../../CommonComponents/ToggleSwitch/ToggleSwitch";

export const counterModes = Object.freeze({
    topicCounter: 1,
    ojCounter: 2,
    summary: 3,
    adjustment: 4
});

const sortByOptions = Object.freeze({
    topicName: 1,
    solveCount: 2,
    difficulty: 3
});

const orderByOptions = Object.freeze({
    asc: 1,
    desc: 2
});

const solveCountFilterModeOptions = Object.freeze({
    lessThan: 1,
    lessThanOrEqualTo: 2,
    equalTo: 3,
    greaterThanOrEqualTo: 4,
    greaterThan: 5
});

const CounterManager = () => {
    /**
     * define states
     */
    const [mode, setMode] = useState(counterModes.topicCounter);
    const [viewMode, setViewMode] = useState(counterViewMode.showAll);
    const [currentDate, setCurrentDate] = useState(Datetime.today);
    const [topicCounterDate, setTopicCounterDate] = useState(Datetime.today);
    const [_, refreshAllCounters] = useState(1);
    const [topicCounterList, setTopicCounterList] = useState([]);
    const [topicCounterComponents, setTopicCounterComponents] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalState, setModalState] = useState({modalProps: modalProps, modalContent: null});
    const [searchKeyword, setSearchKeyword] = useState('');
    const [sortBy, setSortBy] = useState(sortByOptions.topicName);
    const [orderBy, setOrderBy] = useState(orderByOptions.asc);
    const [solveCountFilterMode, setSolveCountFilterMode] = useState(solveCountFilterModeOptions.greaterThanOrEqualTo);
    const [solveCountCriteria, setSolveCountCriteria] = useState('');
    const [showDifficulty, setShowDifficulty] = useState(false);

    const alert = useContext(AlertListContext);

    const refresh = () => {
        alert.pushAlert('All counters has been reloaded.', 2000);
        refreshAllCounters(r => r + 1);
    }

    const updateCurrentDate = date => {
        setCurrentDate(date)
        setTopicCounterDate(date);
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
        setTopicCounterList(topicCounterList.map(count => {
            if (count.date === date && count.topicId === topicId) {
                const modifiedCount = {...count};
                modifiedCount.solveCount = (solveCount < 0 ? 0 : solveCount);
                return modifiedCount;
            }
            return count;
        }));
    }

    const saveChanges = async () => {
        const response = await fetchAPI(CountService.updateCounts, apiMethodTypes.PUT, {counts: topicCounterList})
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

    const horizontalTabs = {
        tabs: [
            {
                id: counterViewMode.showAll,
                name: 'Show All'
            },
            {
                id: counterViewMode.showSolved,
                name: 'Solved'
            },
            {
                id: counterViewMode.showUnsolved,
                name: 'Unsolved'
            }
        ],
        onClick: setViewMode
    };

    const verticalTabs = {
        tabs: [
            {
                id: counterModes.topicCounter,
                name: 'Topic Counter'
            },
            {
                id: counterModes.ojCounter,
                name: 'OJ Counter'
            },
            {
                id: counterModes.summary,
                name: 'Summary'
            },
            {
                id: counterModes.adjustment,
                name: 'Adjustments'
            }
        ],
        onClick: setMode
    };

    const solveCountFilterModeIconClasses = [
        '',
        'fas fa-less-than',
        'fas fa-less-than-equal',
        'fas fa-equals',
        'fas fa-greater-than-equal',
        'fas fa-greater-than'
    ];

    useEffect(() => {
        switch (mode) {
            case counterModes.topicCounter:
                setCurrentDate(topicCounterDate);
                break;
            case counterModes.ojCounter:
                setCurrentDate(new Datetime({date: Datetime.extractDateParameter(new Date(OnlineJudgeFlag))}));
                break;
            case counterModes.summary:
                setCurrentDate(new Datetime({date: Datetime.extractDateParameter(new Date(SummaryFlag))}));
                break;
            case counterModes.adjustment:
                setCurrentDate(new Datetime({date: Datetime.extractDateParameter(new Date(AdjustmentFlag))}));
                break;
            default:
                break;
        }
    }, [mode]);

    useEffect(() => {
        const action = async () => {
            const response = await fetchAPI(`${CountService.getAllCounts}/${currentDate.date}`, apiMethodTypes.GET);
            if (response.generalResponse.isSuccess) {
                setTopicCounterList(response.counts);
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
    }, [_, currentDate]);

    useEffect(() => {
        setTopicCounterComponents(topicCounterList.sort((c1, c2) => {
            if (sortBy === sortByOptions.topicName) {
                return (orderBy === orderByOptions.asc) ? c1.topicName.localeCompare(c2.topicName) : c2.topicName.localeCompare(c1.topicName);
            }
            else if (sortBy === sortByOptions.solveCount) {
                return (orderBy === orderByOptions.asc) ? ((c2.solveCount <= c1.solveCount) ? 1 : -1) : ((c1.solveCount <= c2.solveCount) ? 1 : -1);
            }
            else if (sortBy === sortByOptions.difficulty) {
                return (orderBy === orderByOptions.asc) ? ((c2.difficulty <= c1.difficulty) ? 1 : -1) : ((c1.difficulty <= c2.difficulty) ? 1 : -1);
            }
        }).map(count => {
            const passBySearchKeyword = isNullOrEmpty(searchKeyword) || count.topicName.toLocaleLowerCase().includes(searchKeyword.toLocaleLowerCase());
            let passBySolveCountCriteria = isNullOrEmpty(solveCountCriteria);

            if (solveCountFilterMode === solveCountFilterModeOptions.lessThan && count.solveCount < Number.parseInt(solveCountCriteria)) {
                passBySolveCountCriteria = true;
            }
            else if (solveCountFilterMode === solveCountFilterModeOptions.lessThanOrEqualTo && count.solveCount <= Number.parseInt(solveCountCriteria)) {
                passBySolveCountCriteria = true;
            }
            else if (solveCountFilterMode === solveCountFilterModeOptions.equalTo && count.solveCount === Number.parseInt(solveCountCriteria)) {
                passBySolveCountCriteria = true;
            }
            else if (solveCountFilterMode === solveCountFilterModeOptions.greaterThanOrEqualTo && count.solveCount >= Number.parseInt(solveCountCriteria)) {
                passBySolveCountCriteria = true;
            }
            else if (solveCountFilterMode === solveCountFilterModeOptions.greaterThan && count.solveCount > Number.parseInt(solveCountCriteria)) {
                passBySolveCountCriteria = true;
            }

            if (passBySearchKeyword && passBySolveCountCriteria) {
                return (
                    <Counter 
                        key={`${count.date}_${count.topicId}`} 
                        mode={mode}
                        viewMode={viewMode}
                        data={count}
                        updateCount={updateCount}
                        showDifficulty={showDifficulty} />
                )
            }
            return null;
        }));
    }, [topicCounterList, mode, viewMode, searchKeyword, sortBy, orderBy, solveCountFilterMode, solveCountCriteria, showDifficulty]);

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
                    <div className={[cssClasses.Date, cssClasses.TitleOnly].join(' ')}>
                        <RenderOnCondition condition={mode === counterModes.summary} children={"Topic Counter Summary"} />
                        <RenderOnCondition condition={mode === counterModes.adjustment} children={"Counter Adjustments"} />
                        <RenderOnCondition condition={mode === counterModes.ojCounter} children={`Total Solved: ${topicCounterList.reduce((sum, count) => sum += count.solveCount, 0)}`} />
                    </div>
                </div>

                <div className={cssClasses.CounterListRoot}>
                    <TabBar verticalTabs={verticalTabs} horizontalTabs={horizontalTabs}>
                        <div className={cssClasses.SearchBar}>
                            <label htmlFor="searchKeyword"><FAIcon iconClasses={["fad fa-search"]} /></label>
                            <input className={cssClasses.SearchKeyword} id="searchKeyword" type="text" maxLength={24} onChange={e => setSearchKeyword(e.target.value)} />
                        </div>

                        <div className={[cssClasses.FilterGroup]}>  
                            <RadioGroup title="Sort by" name="sortBy" options={[
                                {
                                    label: 'Topic Name',
                                    value: sortByOptions.topicName
                                },
                                {
                                    label: 'Solve Count',
                                    value: sortByOptions.solveCount
                                },
                                {
                                    label: 'Difficulty',
                                    value: sortByOptions.difficulty
                                }
                            ]} onChange={setSortBy} checkedOption={sortBy}/>

                            <RadioGroup title="Order by" name="orderBy" options={[
                                {
                                    label: 'Ascending',
                                    value: orderByOptions.asc
                                },
                                {
                                    label: 'Descending',
                                    value: orderByOptions.desc
                                }
                            ]} onChange={setOrderBy} checkedOption={orderBy}/>   
                                                        
                            <ToggleSwitch state={showDifficulty} text={'Show Difficulty'} onClick={() => setShowDifficulty(state => !state)} /> 
                            
                            <div className={cssClasses.SolveCountFilter}>
                                <label htmlFor="solveCountCriteria"><FAIcon iconClasses={["fas fa-hashtag"]} /></label>
                                <button className={cssClasses.CompareButton} onClick={() => setSolveCountFilterMode(s => ((s + 1) % 6) + ((s === solveCountFilterModeOptions.greaterThan) ? 1 : 0))}>
                                    <FAIcon iconClasses={[solveCountFilterModeIconClasses[solveCountFilterMode]]} />
                                </button>
                                <input className={cssClasses.SearchKeyword} id="solveCountCriteria" type="number" max="9999" onChange={e => setSolveCountCriteria(e.target.value)} />
                            </div>
                        </div>

                        <div className={[cssClasses.Panel, cssClasses.CounterList].join(' ')}>
                            {topicCounterComponents}
                        </div>
                    </TabBar>
                </div>

                <div className={[cssClasses.Panel, cssClasses.ActionPanel].join(' ')}>
                    <button className={cssClasses.Button} onClick={refresh}>Refresh</button>
                    
                    <RenderOnCondition condition={mode !== counterModes.summary}>
                        <button className={cssClasses.Button} onClick={saveChanges}>Save Changes</button>
                    </RenderOnCondition>
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
