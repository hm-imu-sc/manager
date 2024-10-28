import React, { useState, useEffect } from "react";
import Tag from "./Tag/Tag";
import cssClasses from "./TagManager.module.css";
import Modal, { modalModes, modalProps } from "../../../CommonComponents/Modal/Modal";
import DialogBox from "../../../CommonComponents/DialogBox/DialogBox";
import { updateProps } from "../../../modules/Helpers";
import { TagService } from "../../../modules/ServiceUrls";
import InputBox from "../../../CommonComponents/InputBox/InputBox";
import { inputTypes } from "../../../CommonComponents/InputBox/InputRow/InputRow";
import FAIcon from "../../../CommonComponents/FAIcon/FAIcon";

export const TagManagerTitle = "Manage Tags";

const TagManager = () => {
    /**
     * define states
     */
    const [tagList, setTagList] = useState([]);
    const [tagComponents, setTagComponents] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalState, setModalState] = useState({
        modalProps: modalProps,
        modalContent: null
    });

    /**
    * Intial loading of all tags
    */
    useEffect(() => {
        const action = async () => {
            try {
                const response = await (await fetch(TagService.getAllTags)).json();
                if (response.generalResponse.isSuccess) {
                    setTagList(response.tags);
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
     * Add a new tag
     */
    const addTag = () => {
        setModalState({
            modalProps: {
                renderingMode: modalModes.mini,
                title: 'Add tag:'
            },
            modalContent: (
                <InputBox 
                    inputRows={
                        [
                            [
                                {
                                    type: inputTypes.text,
                                    label: 'Tag name',
                                    value: '',
                                }
                            ]
                        ]
                    } 
                    cancelButtonOnClick={() => setIsModalVisible(false)}
                    saveButtonOnClick={async (uniqueId, data, actionSet) => {
                        try {
                            const newTagName = data[0][0].value;
                            if (newTagName.length > 0) {
                                const response = await fetch(TagService.createTag, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({name: newTagName}),
                                });
                                
                                const r = await response.json();
                                
                                if (r.generalResponse.isSuccess) {
                                    setTagList([...tagList.map(t => ({...t})), {id: r.id, name: newTagName}]);
                                    setIsModalVisible(false);
                                }
                                else {
                                    actionSet.failedAction(r.generalResponse.message);
                                }
                            }
                            else {
                                actionSet.failedAction('Tag name cannot be empty.');
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
     * Create tag components
     */
    useEffect(() => {
        const components = [];
        for (let i = 0; i < tagList.length; i++) {
            /**
             * Delete a tag
             */
            const deleteTag = () => {
                setModalState(updateProps(modalState, {
                    modalProps: {
                        renderingMode: modalModes.mini,
                        title: "Confirmation:"
                    },
                    modalContent: (
                        <DialogBox 
                            mode="confirmation"
                            content={`Confirm deletion of tag '${tagList[i].name}' ?`} 
                            cancelButtonText="Close"
                            cancelButtonOnClick={() => setIsModalVisible(false)} 
                            confirmButtonOnClick={
                                async () => {
                                    try {
                                        const response = await (await fetch(`${TagService.deleteTag}/${tagList[i].id}`, {
                                            method: 'DELETE',
                                            headers: {
                                            'Content-Type': 'application/json',
                                            },
                                        })).json();
                                        setIsModalVisible(false);
                                        
                                        if (response.generalResponse.isSuccess) {
                                            let newTagList = [...tagList];
                                            newTagList.splice(i, 1);
                                            setTagList(newTagList);
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
                                                    content="Could not delete tag !!!"
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
             * Edit a tag
             */
            const editTag = () => {
                setModalState({
                    modalProps: {
                        renderingMode: modalModes.mini,
                        title: 'Edit tag:'
                    },
                    modalContent: (
                        <InputBox 
                            uniqueId={tagList[i].id}
                            inputRows={
                                [
                                    [
                                        {
                                            type: inputTypes.text,
                                            label: 'Name',
                                            value: tagList[i].name,
                                        }
                                    ]
                                ]
                            } 
                            cancelButtonOnClick={() => setIsModalVisible(false)}
                            saveButtonOnClick={async (uniqueId, data, actionSet) => {
                                try {
                                    const newTagName = data[0][0].value;

                                    if (newTagName !== tagList[i].name && newTagName !== '') {
                                        const response = await (await fetch(TagService.updateTag, {
                                            method: 'PUT',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({tag: {id: tagList[i].id, name: newTagName}}),
                                        })).json();
    
                                        if (response.generalResponse.isSuccess) {
                                            setTagList(tagList.map(t => t.id === uniqueId ? {id: t.id, name: newTagName} : {...t}))
                                            setIsModalVisible(false);
                                        }
                                        else {
                                            actionSet.failedAction(response.generalResponse.message);
                                        }
                                    }
                                    else if (newTagName === '') {
                                        actionSet.failedAction('Tag name cannot be empty !!!');
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
                <Tag key={i} name={tagList[i].name} editButtonOnClick={editTag} deleteButtonOnClick={deleteTag} />
            ));
        }
        setTagComponents(components);
    }, [tagList]);

    return (
        <React.Fragment>
            <div className={cssClasses.TagList}>
                {tagComponents}
            </div>      
            <div>
                <button className={cssClasses.AddTag} onClick={addTag}>
                    <FAIcon iconClasses={['fas fa-plus fa-xs', cssClasses.AddTagIcon]} />
                </button>
            </div> 
            {isModalVisible ?
                <Modal data={tagList} renderingMode={modalState.modalProps.renderingMode} title={modalState.modalProps.title} setIsVisible={setIsModalVisible} >
                    {modalState.modalContent}
                </Modal>
            : null}
        </React.Fragment>
    );
}

export default TagManager;