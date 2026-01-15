
// this page is made to test the components and their integration ....abhi



import React from 'react';
//import ActionPopup from '../components/ActionPopup';
import './OrchestrationPage.css'; 
// import VehiclePanel from '../components/VehiclePanel';
// import ConfirmationBox from '../components/ConfirmationBox';
// import MapOverlay from '../components/MapOverlay';
import VehiclePanel from '../components/VehiclePanel';

const OrchestrationPage = () => {
  return (
    <div className="orchestration-page">
     
      <div className="background-layer">
        <h1>Mission Orchestration</h1>
        
        <VehiclePanel />
      </div>
    </div>
  );
};

export default OrchestrationPage;
