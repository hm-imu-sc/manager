import './global.css';
import React from 'react';
import cssClasses from './App.module.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppBrowser from './RootComponents/AppBrowser/AppBrowser.js';
import Modal from './CommonComponents/Modal/Modal';
import PST from './ProblemSolvingTrackerApp/ProblemSolvingTrackerApp.js'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<AppBrowser />} />
                <Route exact path="/problem_solving_tracker" element={<PST />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
