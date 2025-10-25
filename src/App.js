// App.jsx route ....abhi
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
// import OrchestrationPage from './pages/OrchestrationPage'; this page is rempved as testing is done ....abhi
import RoutePlanner from './components/RoutePlanner';
import Dashboard from "./components/Dashboard";
import VehiclePanel from './components/VehiclePanel';

import './index.css'; // this is now not in use .....abhi

function App() {
  return (
    <>
      
      <Router>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          {/* <Route path="/ActionPopup" element={<OrchestrationPage />} /> */}
          <Route path="/VehiclePanel" element={<VehiclePanel />} />
          {/* <Route path="/MapOverlay" element={<OrchestrationPage />} /> */}
          {/* <Route path="/ConfirmationBox" element={<OrchestrationPage />} />  orchestration page is deleted ....abhi*/}
          <Route path="/mission-planner" element={<RoutePlanner />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
