import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './SplashScreen.css';
import { useNavigate } from 'react-router-dom';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
const loadingMessages = [
  "Connecting to assets...",
  "Gathering updated info...",
  "Updating database...",
  "Checking road closures...",
  "Loading inventory...",
  "Updating convoy positionings..."
];

const SplashScreen = () => {

  
  const mapContainer = useRef(null);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Change page after delay
    
    const timer = setTimeout(() => {
      navigate('/Dashboard'); 
    }, 8000);// i have set it to 10 sec ... you can change it to 5 sec or 3 sec or whatever you want .... abhi
    
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [77.5946, 12.9716], // Bengaluru ka location constant krr diyea hai dusra bhi krr sktae hai .... abhi
      zoom: 12,
      interactive: false
    });

    map.on('style.load', () => {
      const layers = map.getStyle().layers;
      layers.forEach((layer) => {
        if (layer.type === 'symbol' || layer.layout?.['text-field']) {
          map.setLayoutProperty(layer.id, 'visibility', 'none');
        }
      });
    });
    

    const interval = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % loadingMessages.length);
    }, 2000); 

    return () => {
     clearTimeout(timer);//-------new ....abhi
      clearInterval(interval);
     map.remove();//-------new ....abhi
    };
  }, [navigate]);
    

  return (
    <div className="splash-wrapper">
      <div ref={mapContainer} className="map-container" />
      <div className="overlay-content">
        <h1 className="splash-title">Base<span style={{ color: '#8B5CF6' }}>.</span></h1>
        <div className="loading-line" />
        <div className="status-rotating">
          {loadingMessages[currentMessageIndex]}
        </div>
      </div>
      
      
    </div>
    
    
  );
};

export default SplashScreen;
