import React, { useState, useEffect } from "react";
import cssClasses from "./StudyMaterialManager.module.css";
import { modalProps } from "../../../CommonComponents/Modal/Modal";
import { StudyMaterialService } from "../../../modules/ServiceUrls";
import { updateProps } from "../../../modules/Helpers";
import Modal, { modalModes } from "../../../CommonComponents/Modal/Modal";
import DialogBox from "../../../CommonComponents/DialogBox/DialogBox";
import InputBox from "../../../CommonComponents/InputBox/InputBox";
import { inputTypes } from "../../../CommonComponents/InputBox/InputRow/InputRow";
import FAIcon from "../../../CommonComponents/FAIcon/FAIcon";
import StudyMaterial from "./StudyMaterial/StudyMaterial";

export const StudyMaterialManagerTitle = 'Manage Study Materials';

const StudyMaterialManager = () => {
    /**
     * define states
     */
    const [studyMaterialList, setStudyMaterialList] = useState([]);
    const [studyMaterialComponents, setStudyMaterialComponents] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalState, setModalState] = useState({
        modalProps: modalProps,
        modalContent: null
    });

    /**
    * Intial loading of all study materials
    */
    useEffect(() => {
        const action = async () => {
            try {
                const response = await (await fetch(StudyMaterialService.getAllStudyMaterials)).json();
                if (response.generalResponse.isSuccess) {
                    setStudyMaterialList(response.studyMaterials);
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
        action();
    }, []);

    /**
     * Add a new study material
     */
    const addStudyMaterial = () => {
        setModalState({
            modalProps: {
                renderingMode: modalModes.mini,
                title: 'Add study material:'
            },
            modalContent: (
                <InputBox 
                    inputRows={
                        [
                            [
                                {
                                    type: inputTypes.text,
                                    label: 'Title',
                                    value: '',
                                }
                            ],
                            [
                                {
                                    type: inputTypes.text,
                                    label: 'URL',
                                    value: '',
                                }
                            ]
                        ]
                    } 
                    cancelButtonOnClick={() => setIsModalVisible(false)}
                    saveButtonOnClick={async (uniqueId, data, actionSet) => {
                        try {
                            const newTitle = data[0][0].value;
                            const newURL = data[1][0].value;
                            if (newTitle.length > 0 && newURL.length > 0) {
                                const response = await fetch(StudyMaterialService.createStudyMaterial, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({study_material: {id:-1, title: newTitle, url: newURL}}),
                                });
                                
                                const r = await response.json();
                                
                                if (r.generalResponse.isSuccess) {
                                    setStudyMaterialList([...studyMaterialList.map(sm => ({...sm})), {id: r.id, title: newTitle, url: newURL}]);
                                    setIsModalVisible(false);
                                }
                                else {
                                    actionSet.failedAction(r.generalResponse.message);
                                }
                            }
                            else {
                                actionSet.failedAction('Title and URL cannot be empty.');
                            }
                        } catch (error) {
                            actionSet.failedAction(error.message);
                        }
                    }} />
            )
        });
        setIsModalVisible(true);
    }

    /**
     * Create study material components
     */
    useEffect(() => {
        const components = [];

        if (studyMaterialList === undefined) {
            return;
        }

        for (let i = 0; i < studyMaterialList.length; i++) {
            /**
             * Delete a study material
             */
            const deleteStudyMaterial = () => {
                setModalState(updateProps(modalState, {
                    modalProps: {
                        renderingMode: modalModes.mini,
                        title: "Confirmation:"
                    },
                    modalContent: (
                        <DialogBox 
                            mode="confirmation"
                            content={`Confirm deletion of study material '${studyMaterialList[i].title}' ?`} 
                            cancelButtonText="Close"
                            cancelButtonOnClick={() => setIsModalVisible(false)} 
                            confirmButtonOnClick={
                                async () => {
                                    try {
                                        const response = await (await fetch(`${StudyMaterialService.deleteStudyMaterial}/${studyMaterialList[i].id}`, {
                                            method: 'DELETE',
                                            headers: {
                                            'Content-Type': 'application/json',
                                            },
                                        })).json();
                                        setIsModalVisible(false);
                                        
                                        if (response.generalResponse.isSuccess) {
                                            let newStudyMaterialList = [...studyMaterialList];
                                            newStudyMaterialList.splice(i, 1);
                                            setStudyMaterialList(newStudyMaterialList);
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
                                                    content="Could not delete !!!"
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
             * Edit a study material
             */
            const editStudyMaterial = () => {
                setModalState({
                    modalProps: {
                        renderingMode: modalModes.mini,
                        title: 'Edit study material:'
                    },
                    modalContent: (
                        <InputBox 
                            uniqueId={studyMaterialList[i].id}
                            inputRows={
                                [
                                    [
                                        {
                                            type: inputTypes.text,
                                            label: 'Title',
                                            value: studyMaterialList[i].title,
                                        }
                                    ],
                                    [
                                        {
                                            type: inputTypes.text,
                                            label: 'URL',
                                            value: studyMaterialList[i].url,
                                        }
                                    ]
                                ]
                            } 
                            cancelButtonOnClick={() => setIsModalVisible(false)}
                            saveButtonOnClick={async (uniqueId, data, actionSet) => {
                                try {
                                    const newTitle = data[0][0].value;
                                    const newUrl = data[1][0].value;

                                    if ((newTitle !== studyMaterialList[i].title && newTitle !== '') || (newUrl !== studyMaterialList[i].url && newUrl !== '')) {
                                        const response = await (await fetch(StudyMaterialService.updateStudyMaterial, {
                                            method: 'PUT',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({study_material: {id: studyMaterialList[i].id, title: newTitle, url: newUrl}}),
                                        })).json();
    
                                        if (response.generalResponse.isSuccess) {
                                            setStudyMaterialList(studyMaterialList.map(sm => sm.id === uniqueId ? {id: sm.id, title: newTitle, url: newUrl} : {...sm}))
                                            setIsModalVisible(false);
                                        }
                                        else {
                                            actionSet.failedAction(response.generalResponse.message);
                                        }
                                    }
                                    else if (newTitle === '' || newUrl === '') {
                                        actionSet.failedAction('Title and URL cannot be empty !!!');
                                    }
                                } catch (error) {
                                    actionSet.failedAction(error.message);
                                }
                            }} />
                    )
                });
                setIsModalVisible(true);
            }

            components.push((
                <StudyMaterial 
                    key={i} 
                    url={studyMaterialList[i].url}
                    title={studyMaterialList[i].title} 
                    editButtonOnClick={editStudyMaterial} 
                    deleteButtonOnClick={deleteStudyMaterial} />
            ));
        }
        setStudyMaterialComponents(components);
    }, [studyMaterialList]);

    return (
        <React.Fragment>
            <div className={cssClasses.StudyMaterialList}>
                {studyMaterialComponents}
            </div>      
            <div>
                <button className={cssClasses.AddStudyMaterial} onClick={addStudyMaterial}>
                    <FAIcon iconClasses={['fad fa-plus fa-xs', cssClasses.AddStudyMaterialIcon]} />
                </button>
            </div> 
            {isModalVisible ?
                <Modal data={studyMaterialList} renderingMode={modalState.modalProps.renderingMode} title={modalState.modalProps.title} setIsVisible={setIsModalVisible} >
                    {modalState.modalContent}
                </Modal>
            : null}
        </React.Fragment>
    );
}

export default StudyMaterialManager;
