import React, {Fragment, useContext} from "react";
import cssClasses from "./TestArea.module.css";
import { setDefaultProps } from "../modules/Helpers";
import { Link } from "react-router-dom";
import FAIcon from "../CommonComponents/FAIcon/FAIcon";
import TabBar from "../CommonComponents/TabBar/TabBar";
import AlertListContext from "../Context/AlertListContext";

const defaultProps = Object.freeze({});

const TestArea = (props) => {
    props = setDefaultProps(props, defaultProps);

    const alert = useContext(AlertListContext);

    const horizontalTabOnClick = id => {
        alert.pushAlert(`Clicked on horizontal tab ${id}`, 3000);
    }

    const verticalTabOnClick = id => {
        alert.pushAlert(`Clicked on vertical tab ${id}`, 3000);
    }

    const horizontalTabNames = ['Tab 1', 'Tab 2', 'Tab 3'];
    const verticalTabNames = ['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4', 'Tab 5'];

    const horizontalTabs = {
        tabs: horizontalTabNames.map((ht, idx) => ({id: idx, name: ht})),
        onClick: horizontalTabOnClick
    };

    const verticalTabs = {
        tabs: verticalTabNames.map((vt, idx) => ({id: idx, name: vt})),
        onClick: verticalTabOnClick
    };

    return (
        <Fragment>
            <Link className={[cssClasses.Loader, cssClasses.AppBrowser].join(" ")} to="/">
                <FAIcon iconClasses={['fad fa-arrow-left']} />
            </Link>
            <div className={cssClasses.RootDiv}>
                <TabBar verticalTabs={verticalTabs} horizontalTabs={horizontalTabs}>
                    <h1>Data goes here.</h1>
                </TabBar>
            </div>
        </Fragment>
    );
}

export default TestArea;