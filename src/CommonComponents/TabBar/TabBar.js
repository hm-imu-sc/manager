import React, { useEffect, useState } from "react";
import { defaultCallBack } from "../../modules/DefaultValues";
import RenderOnCondition from "../RenderOnCondition/RenderOnCondition";
import cssClasses from "./TabBar.module.css";
import { setDefaultProps } from "../../modules/Helpers";
import Tab from "./Tab/Tab";

const defaultProps = Object.freeze({
    horizontalTabs: {
        tabs: [],
        onClick: defaultCallBack
    },
    verticalTabs: {
        tabs: [],
        onClick: defaultCallBack
    }
});

const TabBar = (props) => {
    props = setDefaultProps(props, defaultProps);

    const [horizontalTabsActiveStatus, setHorizontalTabsActiveStatus] = useState({});
    const [verticalTabsActiveStatus, setVerticalTabsActiveStatus] = useState({});

    useEffect(() => {
        const activeStatus = {};
        for (let i = 0; i < props.horizontalTabs.tabs.length; i++) {
            const tab = props.horizontalTabs.tabs[i];
            activeStatus[tab.id] = (i === 0);
        }
        setHorizontalTabsActiveStatus(activeStatus);
    }, []);

    useEffect(() => {
        const activeStatus = {};
        for (let i = 0; i < props.verticalTabs.tabs.length; i++) {
            const tab = props.verticalTabs.tabs[i];
            activeStatus[tab.id] = (i === 0);
        }
        setVerticalTabsActiveStatus(activeStatus);
    }, []);

    const selectTab = (setActiveStatus, tabId) => {
        setActiveStatus(tabs => {
            const modifiedTabs = {...tabs};
            for (const key of Object.keys(modifiedTabs)) {
                modifiedTabs[Number.parseInt(key)] = (Number.parseInt(key) === tabId);
            }
            return modifiedTabs;
        });
    }

    const selectHorizontalTab = tabId => {
        props.horizontalTabs.onClick(tabId);
        selectTab(setHorizontalTabsActiveStatus, tabId);
    }

    const selectVerticalTab = tabId => {
        props.verticalTabs.onClick(tabId);
        selectTab(setVerticalTabsActiveStatus, tabId);
    }

    return (
        <div className={cssClasses.RootDiv}>
            <RenderOnCondition condition={props.horizontalTabs.tabs.length > 0}>
                <div className={cssClasses.HorizontalTabs}>
                    {
                        props.horizontalTabs.tabs.map(tab => (
                            <Tab key={tab.id} id={tab.id} name={tab.name} onClick={selectHorizontalTab} isActive={horizontalTabsActiveStatus[tab.id]} />
                        ))
                    }
                </div>
            </RenderOnCondition>
            <RenderOnCondition condition={props.verticalTabs.tabs.length > 0}>
                <div className={cssClasses.VerticalTabs}>
                    {
                        props.verticalTabs.tabs.map(tab => (
                            <Tab key={tab.id} id={tab.id} name={tab.name} onClick={selectVerticalTab} isActive={verticalTabsActiveStatus[tab.id]} />
                        ))
                    }
                </div>
            </RenderOnCondition>
            {props.children}
        </div>
    );
}

export default TabBar;