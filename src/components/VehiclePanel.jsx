import React, { useState } from "react";
import "./VehiclePanel.css";

const VehicleCategory = ({ title }) => (
  <div className="vehicle-category">{title}</div>
);

const VehicleItem = ({
  type,
  id = "",
  hours = "",
  capacity = "",
  availability = "",
  warning = false,
  imageUrl = "/placeholder.png",
}) => {
  const isAvailable = availability.includes("Available");

  return (
    <div className="vehicle-item">
      <div className={`availability ${isAvailable ? "available" : "unavailable"}`}>
        {availability}
      </div>
      <div className="vehicle-content">
        <div className="vehicle-header">
          <div className="vehicle-type">{type}</div>
          {warning && <span className="warning-signal" title="Warning Signal" />}
        </div>
        <div className="vehicle-details">
          <div><span className="label1" style={{ color: "black" }}>ID:</span> {id}</div>
          <div><span className="label1" style={{ color: "black" }}>Hours:</span> {hours} Available</div>
          <div><span className="label1" style={{ color: "black" }}>Capacity:</span> {capacity}</div>
        </div>
      </div>
      <img src={imageUrl} alt={type} className="vehicle-image" />
    </div>
  );
};
const VehiclePanel = () => {
  const vehicleTypes = [
    { title: "Army Vehicles" },
    { title: "Civil Vehicles" },
    { title: "Support Vehicles" },
    { title: "Transit-Camps Vehicles" },
  ];

  const vehicles = [
    {
      type: "Tatra T815",
      id: "LTR-TRS-58",
      hours: 210,
      capacity: "25000Kg",
      availability: "18 Available",
      warning: false,
      imageUrl: "/images/a.png",
    },
    {
      type: "Tata LPTA",
      id: "LTR-TRS-64",
      hours: 250,
      capacity: "13000Kg",
      availability: "10 units will be available in 3 hours",
      warning: true,
      imageUrl: "/images/b.png",
    },
    {
      type: "Tatra T815-7A",
      id: "LTR-TRS-58",
      hours: 210,
      capacity: "20000Kg",
      availability: "7 Available",
      warning: false,
      imageUrl: "/images/c.png",
    },
    {
      type: "AL- Stallion",
      id: "LTR-TRS-58",
      hours: 210,
      capacity: "25000Kg",
      availability: "13 units more will be added in 34 minutes",
      warning: true,
      imageUrl: "/images/d.png",
    },
    {
      type: "Force Gurkha",
      id: "LTR-TRS-46",
      hours: 150,
      capacity: "",
      availability: "4 Available\n7 more in 20 minutes",
      warning: false,
      imageUrl: "/images/e.png",
    },
    {
      type: "Tata Safari Storm",
      id: "LTR-TRS-68",
      hours: 180,
      capacity: "",
      availability: "4 units more will be added in 46 minutes",
      warning: false,
      imageUrl: "/images/f.png",
    },
    {
      type: "AL- Stallion",
      id: "LTR-TRS-58",
      hours: 210,
      capacity: "",
      availability: "12 Available",
      warning: false,
      imageUrl: "/images/c.png",
    },
    {
      type: "Tata LPTA",
      id: "LTR-TRS-64",
      hours: 250,
      capacity: "13000Kg",
      availability: "10 units will be available in 3 hours",
      warning: false,
      imageUrl: "/images/d.png",
    },
    {
      type: "Tatra T815-7A",
      id: "LTR-TRS-58",
      hours: 210,
      capacity: "20000Kg",
      availability: "14 Available",
      warning: false,
      imageUrl: "/images/c.png",
    },
  ];

  return (
    <div className="vehicle-panel">

      <div className="vehicle-categories">
        {vehicleTypes.map((type, idx) => (
          <VehicleCategory key={idx} title={type.title} />
        ))}
      </div>
      <div className="vehicle-list">
        {vehicles.map((vehicle, idx) => (
          <VehicleItem key={idx} {...vehicle} />
        ))}
      </div>
      

      
      
    </div>
  );
};

export default VehiclePanel;