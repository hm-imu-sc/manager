import React from "react";
import Topic from "./Topic/Topic";
import cssClasses from "./TopicManager.module.css";

export const TopicManagerTitle = 'Manage Topics';

const TopicManager = () => {
    return (
        // <h1>This is the topic manager !!!</h1>
        <div className={cssClasses.TopicList}>
            <Topic openEditor={true} />
            <Topic />
            <Topic />
            <Topic />
            <Topic />
            <Topic />
        </div>
    );
}

export default TopicManager;