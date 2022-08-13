import React from 'react';
import logo from './logo.svg';
import "destyle.css";
import './App.module.scss';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AvailabilityTracker from './pages/AvailabilityTracker/AvailabilityTracker';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path={"/"} element={<AvailabilityTracker />} />
          {/* All 404's should redirect back to home page */}
          <Route path={"*"} element={<Navigate replace to={"/"} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
