import './global.css';
import React from 'react';
import cssClasses from './App.module.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppBrowser from './RootComponents/AppBrowser/AppBrowser.js';
import PST from './ProblemSolvingTrackerApp/ProblemSolvingTrackerApp.js'
import TestArea from './TestArea/TestArea';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<AppBrowser />} />
                <Route exact path="/problem_solving_tracker" element={<PST />} />
                <Route exact path="/test_area" element={<TestArea />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
