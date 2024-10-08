import React, { useState, useEffect } from "react";
import Tag from "./Tag/Tag";
import cssClasses from "./TagManager.module.css";

export const TagManagerTitle = "Manage Tags";

const TagManager = () => {
    const [tagList, setTagList] = useState([])

    useEffect(() => {
        fetch('https://localhost:7014/get_all_tags')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(json => {
                if (json.generalResponse.isSuccess) {
                    setTagList(json.tags);
                }   
                else {
                    alert(json.generalResponse.message);
                } 
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const addTag = async (event) => {
        let newTagName = document.querySelector("#newTagName").value;
        if (newTagName.length > 0) {
            const response = await fetch('https://localhost:7014/create_tag', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name: newTagName}),
            });
        
            const r = await response.json();
        
            if (r.generalResponse.isSuccess) {
                setTagList([...tagList, {id: r.id, name: newTagName}]);
            }
            else {
                alert(r.generalResponse.message);
            }
        }
    }

    let tagComponents = []
    for (let tag of tagList) {
        tagComponents.push((
            <Tag id={tag.id} name={tag.name} />
        ));
    }

    return (
        <React.Fragment>
            <div className={cssClasses.TagList}>
                {tagComponents}
            </div>      
            <div>
                <input className={cssClasses.NewTagName} type="text" name="newTagName" id="newTagName" maxLength={20} />
                <button className={cssClasses.AddTag} onClick={addTag}>Add</button>
            </div>    
        </React.Fragment>
    );
}

export default TagManager;