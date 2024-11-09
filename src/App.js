import './global.css';
import React, { useState } from 'react';
import cssClasses from './App.module.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppBrowser from './RootComponents/AppBrowser/AppBrowser.js';
import PST from './ProblemSolvingTrackerApp/ProblemSolvingTrackerApp.js'
import TestArea from './TestArea/TestArea';
import AlertListContext from './Context/AlertListContext';
import AlertBox from './CommonComponents/AlertBox/AlertBox';
import Alert from './CommonComponents/AlertBox/Alert/Alert';

function App() {
    const [alertList, setAlertList] = useState([]);
    const pushAlert = (message, timeout) => {
        setAlertList(latestAlertList => [...latestAlertList.map(a => ({...a})), {message: message, timeout: timeout}]);
    }

    return (
        <AlertListContext.Provider value={{pushAlert: pushAlert}}>
            <BrowserRouter>
                <Routes>
                    <Route exact path="/" element={<AppBrowser />} />
                    <Route exact path="/problem_solving_tracker" element={<PST />} />
                    <Route exact path="/test_area" element={<TestArea />} />
                </Routes>
            </BrowserRouter>
            <AlertBox>
                {
                    alertList.map((alert, idx) => (<Alert key={idx} message={alert.message} timeout={alert.timeout} />))
                }
            </AlertBox>
        </AlertListContext.Provider>
    );
}

export default App;
