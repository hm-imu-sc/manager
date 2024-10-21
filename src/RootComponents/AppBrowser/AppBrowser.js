import React from 'react';
import cssClasses from './AppBrowser.module.css';
import { Link } from 'react-router-dom';

const AppBrowser = () => {
    return (
        <div className={cssClasses.Apps}>
            <Link className={cssClasses.App} to="/problem_solving_tracker">Problem Solving Tracker</Link>
            <Link className={cssClasses.App} to="/test_area">Test Area</Link>
            {/* <Routes>
                <Route exact path="/problem_solving_tracker" element={<PST />} />
            </Routes> */}
        </div>
    );
}

export default AppBrowser;
