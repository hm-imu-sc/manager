import React, { useState, useEffect } from "react";
import Tag from "./Tag/Tag";
import cssClasses from "./TagManager.module.css";
import Modal, { modalModes, modalProps } from "../../../CommonComponents/Modal/Modal";
import DialogBox from "../../../CommonComponents/DialogBox/DialogBox";
import { updateProps } from "../../../modules/Helpers";
import { TagService } from "../../../modules/ServiceUrls";
import InputBox from "../../../CommonComponents/InputBox/InputBox";
import { inputTypes } from "../../../CommonComponents/InputBox/InputRow/InputRow";

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
    const addTag = (event) => {
        const action = async () => {
            let tagNameField = document.querySelector("#newTagName");
            let newTagName = tagNameField.value;

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
                    tagNameField.value = "";
                }
                else {
                    setModalState(updateProps(modalState, {
                        modalProps: {
                            renderingMode: modalModes.mini,
                            title: "Failed !"
                        },
                        modalContent: (
                            <DialogBox 
                                content={r.generalResponse.message}
                                cancelButtonText="Close" 
                                cancelButtonOnClick={() => setIsModalVisible(false)} />
                        )
                    }));
                    setIsModalVisible(true);
                }
            }
        }
        action();
    }
    
    useEffect(() => {
        const components = [];
        /**
         * Create tag components
         */
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
                        renderingMode: modalModes.medium,
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
                                    const response = await (await fetch(TagService.updateTag, {
                                        method: 'PUT',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({tag: {id: tagList[i].id, name: data[0][0].value}}),
                                    })).json();

                                    if (response.generalResponse.isSuccess) {
                                        setTagList(tagList.map(t => t.id === uniqueId ? {id: t.id, name: data[0][0].value} : {...t}))
                                        setIsModalVisible(false);
                                    }
                                    else {
                                        actionSet.failedAction(response.generalResponse.message);
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
                <input className={cssClasses.NewTagName} type="text" name="newTagName" id="newTagName" maxLength={20} />
                <button className={cssClasses.AddTag} onClick={addTag}>Add</button>
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