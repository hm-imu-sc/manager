import React, { Fragment, useState, useEffect } from "react";
import Topic, { topicRendetingMode } from "./Topic/Topic";
import cssClasses from "./TopicManager.module.css";
import Modal, { modalModes, modalProps } from "../../../CommonComponents/Modal/Modal";
import DialogBox from "../../../CommonComponents/DialogBox/DialogBox";
import { updateProps } from "../../../modules/Helpers";
import { TopicService, TagService, StudyMaterialService } from "../../../modules/ServiceUrls";
import FAIcon from "../../../CommonComponents/FAIcon/FAIcon";

export const TopicManagerTitle = 'Manage Topics';

const TopicManager = () => {

    /**
     * define states
     */
    const [topicList, setTopicList] = useState([]);
    const [allTags, setAllTags] = useState([]);
    const [allStudyMaterials, setAllStudyMaterials] = useState([]);
    const [topicComponents, setTopicComponents] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalState, setModalState] = useState({
        modalProps: modalProps,
        modalContent: null
    });

    /**
    * Intial loading of all topics
    */
    const loadAllTopics = async () => {
        try {
            let response = await (await fetch(TagService.getAllTags)).json();
            if (response.generalResponse.isSuccess) {
                setAllTags(response.tags);
            }

            response = await (await fetch(StudyMaterialService.getAllStudyMaterials)).json();
            if (response.generalResponse.isSuccess) {
                setAllStudyMaterials(response.studyMaterials);
            }

            response = await (await fetch(TopicService.getAllTopics)).json();
            if (response.generalResponse.isSuccess) {
                setTopicList(response.topics.sort((t1, t2) => t1.name.localeCompare(t2.name)));
            }
            else {
                setModalState(updateProps(modalState, {
                    modalProps: {
                        renderingMode: modalModes.mini,
                        title: "Failed !"
                    },
                    modalContent: (
                        <DialogBox 
                            content={response.generalResponse.message} 
                            cancelButtonText="Close"
                            cancelButtonOnClick={() => setIsModalVisible(false)} />
                    )
                }));
                setIsModalVisible(true);
            }
        } catch (error) {
            setModalState(updateProps(modalState, {
                modalProps: {
                    renderingMode: modalModes.mini,
                    title: "Error !"
                },
                modalContent: (
                    <DialogBox 
                        content="Could not fetch data !!!"
                        cancelButtonText="Close"
                        cancelButtonOnClick={() => setIsModalVisible(false)} />
                )
            }));
            setIsModalVisible(true);
        }
    }
    useEffect(() => {
        loadAllTopics();
    }, []);

    /**
     * Add a new topics
     */
    const addTopic = () => {
        const modifiedTopicList = topicList.map(t => ({...t}));
        modifiedTopicList.push({
            id: -1,
            name: "",
            studyMaterials: [],
            tags: [],
            addTopic: async (topicData) => {
                const removeTempTopic = () => {
                    const newTopicList = [];
                    for (const topic of topicList) {
                        if (topic.id != -1) {
                            newTopicList.push({...topic});
                        }
                    }
                    setTopicList(newTopicList);
                }

                if (topicData.isCancel) {
                    removeTempTopic();
                }

                if (!topicData.isCancel) {
                    let isSuccess = true;
                    let message = '';
                    
                    try {
                        const response = await (await fetch(TopicService.createTopic, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({topic: topicData.topicData}),
                        })).json()
                        
                        if (response.generalResponse.isSuccess) {
                            removeTempTopic();
                            topicData.topicData.id = response.id;
                            const newTopicList = topicList.map(t => ({...t}));
                            newTopicList.push(topicData.topicData);
                            setTopicList(newTopicList);
                        }
                        else {
                            isSuccess = false;
                            message = response.generalResponse.message;
                        }
                        
                        return [isSuccess, message];
                    } catch (error) {
                        return [isSuccess, 'Could not add topic !!!'];
                    }
                }
            }
        });
        setTopicList(modifiedTopicList);
    }

    /**
     * Delete a topic
     */
    const deleteTopic = topic => {
        setModalState(updateProps(modalState, {
            modalProps: {
                renderingMode: modalModes.mini,
                title: "Confirmation:"
            },
            modalContent: (
                <DialogBox 
                    mode="confirmation"
                    content={`Confirm deletion of topic '${topic.name}' ?`} 
                    cancelButtonText="Cancel"
                    cancelButtonOnClick={() => setIsModalVisible(false)} 
                    confirmButtonOnClick={
                        async () => {
                            try {
                                debugger;
                                console.log("Deleting:");
                                console.log(topic);
                                const response = await (await fetch(`${TopicService.deleteTopic}/${topic.id}`, {
                                    method: 'DELETE',
                                    headers: {
                                    'Content-Type': 'application/json',
                                    },
                                })).json();
                                setIsModalVisible(false);
                                
                                if (response.generalResponse.isSuccess) {
                                    setTopicList(topics => topics.filter(t => t.id !== topic.id));
                                }
                                else {
                                    setModalState(updateProps(modalState, {
                                        modalProps: {
                                            renderingMode: modalModes.mini,
                                            title: "Failed !!!"
                                        },
                                        modalContent: (
                                            <DialogBox 
                                                content={response.generalResponse.message}
                                                cancelButtonText="Close"
                                                cancelButtonOnClick={() => setIsModalVisible(false)} />
                                        )
                                    }));
                                    setIsModalVisible(true);
                                }
                            } catch (error) {
                                setModalState(updateProps(modalState, {
                                    modalProps: {
                                        renderingMode: modalModes.mini,
                                        title: "Error !"
                                    },
                                    modalContent: (
                                        <DialogBox 
                                            content="Could not delete topic !!!"
                                            cancelButtonText="Close"
                                            cancelButtonOnClick={() => setIsModalVisible(false)} />
                                    )
                                }));
                                setIsModalVisible(true);
                            }
                        }
                    }/>
            )
        }));
        setIsModalVisible(true);
    }

    /**
     * Create topic components
     */
    useEffect(() => {
        const components = [];
        for (let i = 0; i < topicList.length; i++) {

            /**
             * Edit a topic
             */
            const saveTopic = async topic => {
                try {
                    const isSuccess = true;
                    let message = '';
    
                    const response = await (await fetch(TopicService.updateTopic, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({topic: topic}),
                    })).json();
    
                    if (response.generalResponse.isSuccess) {
                        setTopicList(topicList.map(t => t.id === topic.id ? topic : t));
                    }
                    else {
                        isSuccess = false;
                        message = response.generalResponse.message;
                    }
    
                    return [isSuccess, message];   
                } catch (error) {
                    return [false, 'Error saving topic !!!']                    
                }
            }

            components.push((
                <Topic 
                    key={topicList[i].id} 
                    renderingMode={topicList[i].id === -1 ? topicRendetingMode.insert : topicRendetingMode.display}
                    topicData={topicList[i]} 
                    allTags={allTags}
                    allStudyMaterials={allStudyMaterials}
                    saveButtonOnClick={saveTopic} 
                    deleteButtonOnClick={deleteTopic} />
            ));
        }
        setTopicComponents(components);
    }, [topicList, allTags, allStudyMaterials]);

    return (
        <Fragment>
            <div className={cssClasses.TopicList}>
                {topicComponents}
            </div>
            <div>
                <button className={cssClasses.AddTopic} onClick={addTopic}>
                    <FAIcon iconClasses={['fas fa-plus fa-xs', cssClasses.AddTopicIcon]} />
                </button>
            </div> 
            {isModalVisible ?
                <Modal data={topicList} renderingMode={modalState.modalProps.renderingMode} title={modalState.modalProps.title} setIsVisible={setIsModalVisible} >
                    {modalState.modalContent}
                </Modal>
            : null}
        </Fragment>
    );
}

export default TopicManager;