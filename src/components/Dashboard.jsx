import React, { useState, useRef } from 'react';

// import MapOverview from "./MapOverlay"; ... unused file deleted ....abhi
import ConfirmationBox from "./ConfirmationBox";
import VehiclePanel from "./VehiclePanel";
import './Dashboard.css';
import RoutePlanner from "./RoutePlanner";

import routeImage from '../assets/image.png';
import bagIcon from '../assets/bag.png';
import alertIcon from '../assets/alert.png';
import commoditiesIcon from '../assets/commodities.png';
import equipmentIcon from '../assets/equipment.png';
import personnelIcon from '../assets/personnel.png';
import tickIcon from '../assets/tick.png';

const Dashboard = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const plannerRef = useRef(); // to access child method   .....abhi changes fn
  const tracks = [
    { id: "TL-15B-756", status: "On Time" },
    { id: "TL-15B-746", status: "On Time" },
    { id: "TL-4E-8", status: "Delayed" },
    { id: "TL-15B-746", status: "On Time" },
    { id: "TL-15B-746", status: "On Time" },
    { id: "TL-15B-746", status: "On Time" }
  ];



  const handleGeneratePlan = () => {
    if (plannerRef.current) {
      plannerRef.current.planRoute(origin, destination);
    }
  };    //abhi changes this to implement route planning logic   ....abhi changes fn



  return (
    <div className="dashboard-container">
      {/* Map Layer
      <div className="dashboard-maparea">
        <MapOverview />
      </div>     ....   commented out because now using my map with model configurations ......abhi*/}

      {/* Top Navigation */}
      <div className="dashboard-topnav">
        Base<span style={{ color: '#8B5CF6' }}>.</span>
      </div>

      {/* Main Body */}
      <div className="dashboard-body">
        {/* Sidebar */}
        <div className="sidebar-wrapper" >
          
        
          <div className="sidebar-container">
          <div className="box-header">
                <img src={routeImage} alt="Route" className="icon" />
                <h2 className="heading">Route Planner</h2>
                <div className="status-dot green"></div>
              </div>
            {/* Route Planner */}
            <div className="box">
              

              <label className="label"><b>Origin</b></label>
              <input type="text" className="input"  placeholder="Enter origin" value={origin} onChange={(e) => setOrigin(e.target.value)}/>  

              <label className="label1"><b>Halts</b></label>
              <select className="input">
                <option>Halts</option>
                <option>Checkpoint A</option>
                <option>Checkpoint B</option>
              </select>

              <label className="label"><b>Destination</b></label>
              <input type="text" className="input" id="end" placeholder="Enter destination" value={destination} onChange={(e) => setDestination(e.target.value)} />
            </div>
            <div className="box-header">
                <img src={bagIcon} alt="Bag" className="icon" />
                <h2 className="heading">Cargo Status</h2>
                <div className="status-dot blue"></div>
              </div>

            {/* Cargo Status */}
            <div className="box">
              

              <div className="cargo-status">
                {[
                  { label: "Personnels", icon: personnelIcon, statusIcon: tickIcon },
                  { label: "Equipments", icon: equipmentIcon, statusIcon: tickIcon },
                  { label: "Commodities", icon: commoditiesIcon, statusIcon: alertIcon },
                ].map((item, idx) => (
                  <div key={idx} className="cargo-item">
                    <img src={item.icon} alt={item.label} className="cargo-icon" />
                    <span className="cargo-label">{item.label}</span>
                    <img src={item.statusIcon} alt="Status" className="status-icon" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button className="generate-button" onClick={handleGeneratePlan}>
            Generate Plan
          </button>   {/*....abhi id=.... */}

        </div>
        {/* Pass props & ref    ....abhi changed  */}
        <RoutePlanner ref={plannerRef} />

        {/* Tracks Panel */}
        <div className="tracks-panel">
          <div className="tracks-title">Tracks</div>
          {tracks.map((track, idx) => (
            <div
              key={idx}
              className={`track-box ${track.status === "Delayed" ? "track-delayed" : "track-ontime"}`}
            >
              <div className="track-id">Convoy: {track.id}</div>
              <div>Meerut - TCP8</div>
              <div>
                Status:{" "}
                <span className={track.status === "Delayed" ? "status-warn" : "status-ok"}>
                  {track.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Panels */}
      <ConfirmationBox />
      <div className="vehicle-panel-wrapper">
        <VehiclePanel />
      </div>
    </div>
  );
};

export default Dashboard;
