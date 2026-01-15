// abhi changed
import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import mapboxgl from 'mapbox-gl';
import '../components/planner.css';
import ActionPopup from './ActionPopup';

mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';


const fuelFactors = {
  'military-jeep': 0.6,
  'transport-tank': 0.8,
  'battle-tank': 1.2,
  'artillery-vehicle': 1.5,
  'apc': 1.0
};

const speedByVehicle = {
  'military-jeep': 60,
  'transport-tank': 50,
  'battle-tank': 40,
  'artillery-vehicle': 35,
  'apc': 55
};

let currentRoutes = [];
let map;

const RoutePlanner = forwardRef((props, ref) => {
  const [showPopup, setShowPopup] = useState(false);
  const [isRouteVisible, setIsRouteVisible] = useState(false); //  new state ...abhi 

  // abhi changed
  useImperativeHandle(ref, () => ({
    planRoute: (origin, destination, payload = 1000, vehicle = 'military-jeep') => {
      setShowPopup(true);
      startPlanning(origin, destination, payload, vehicle);
    }
  }));

  useEffect(() => {
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [77.209, 28.6139],
      zoom: 4  //you can adjust the map how much you want to zoom i have set to 4 .....abhi
    });


    map.addControl(new mapboxgl.NavigationControl());

    return () => {
      if (map) map.remove();
    };
  }, []);
  useEffect(() => {
    const handler = (e) => highlightRoute(e.detail);
    window.addEventListener('routeSelected', handler);
    return () => window.removeEventListener('routeSelected', handler);
  }, []);
  

  // abhi changed
  const startPlanning = async (start, end, payload, vehicle) => {
    if (!start || !end) return alert('Please enter both start and end locations.');
    if (isNaN(payload) || payload <= 0) return alert('Please enter a valid load in kg.');

    try {
      const [startCoords, endCoords] = await Promise.all([
        geocodeLocation(start),
        geocodeLocation(end)
      ]);

      const routes = await getRoutes(startCoords, endCoords);

      clearRoutes();
      addMarkers(startCoords, endCoords);

      // abhi changed - 9s delay to simulate loading
      setTimeout(() => {
        displayTopRoutes(routes, payload, vehicle);
        window.routes = routes;
        setShowPopup(false);
        setIsRouteVisible(true); // this is to hide the route comparision panel .....abhi
      }, 8000);
    } catch (err) {
      alert(err.message);
      setShowPopup(false);
    }

  };
  const highlightRoute = (index) => {
    const selectedRoute = currentRoutes[index].route;
    const routeBounds = new mapboxgl.LngLatBounds();
    selectedRoute.geometry.coordinates.forEach(coord => routeBounds.extend(coord));
    map.fitBounds(routeBounds, { padding: 100 });
  
    currentRoutes.forEach((r, i) => {
      map.setPaintProperty(r.id, 'line-color', i === index ? '#ffffff' : '#3b82f6');
      map.setPaintProperty(r.id, 'line-width', i === index ? 6 : 2);
      map.setPaintProperty(r.id, 'line-opacity', i === index ? 1 : 0.3);
    });
  
    //  Hide the panel after selecting a route ....abhi
    setIsRouteVisible(false);
  };
  

  return (
    <div className="container">
      {showPopup && <ActionPopup onClose={() => setShowPopup(false)} animated />}

      <main className="map-section">
        <div id="map" title="Map showing planned military route"></div>
        <section className={`comparison-panel ${isRouteVisible ? 'show-comparison' : ''}`} title="Shows route details">{/* abhi changed - added fn to hide comparision panel */}

          <h3>🧭 Route Comparison</h3>
          <div id="route-comparison"></div>
        </section>
      </main>
    </div>
  );
});

//  Utility Functions (abhi changed)
async function geocodeLocation(locationName) {
  const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(locationName)}.json?access_token=${mapboxgl.accessToken}`);
  const data = await response.json();
  if (data.features?.length) return data.features[0].center;
  throw new Error(`Location "${locationName}" not found.`);
}

async function getRoutes(startCoords, endCoords) {
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords[0]},${startCoords[1]};${endCoords[0]},${endCoords[1]}?alternatives=true&geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.routes?.length) return data.routes;
  throw new Error('No routes found.');
}

function clearRoutes() {
  currentRoutes.forEach(route => {
    if (map.getLayer(route.id)) map.removeLayer(route.id);
    if (map.getSource(route.id)) map.removeSource(route.id);
  });
  currentRoutes = [];
}

function addMarkers(startCoords, endCoords) {
  if (window.startMarker) window.startMarker.remove();
  if (window.endMarker) window.endMarker.remove();

  window.startMarker = new mapboxgl.Marker({ color: 'green' }).setLngLat(startCoords).addTo(map);
  window.endMarker = new mapboxgl.Marker({ color: 'red' }).setLngLat(endCoords).addTo(map);
}

function calculateFuel(distance, payload, vehicleType) {
  const baseFuel = distance * 0.5;
  const loadFactor = 1 + (payload - 1000) / 2000;
  const fuelFactor = fuelFactors[vehicleType] || 1.0;
  return Math.round(baseFuel * loadFactor * fuelFactor);
}

function calculateETA(distance, vehicleType) {
  const speed = speedByVehicle[vehicleType] || 50;
  return +(distance / speed).toFixed(2);
}

function displayTopRoutes(routes, payload, vehicleType) {
  const comparisonDiv = document.getElementById('route-comparison');
  comparisonDiv.innerHTML = '';

  const topRoutes = routes.slice(0, 4);
  const bounds = new mapboxgl.LngLatBounds();

  topRoutes.forEach((route, i) => {
    const id = `route-${Date.now()}-${i}`;
    currentRoutes.push({ id, route });

    map.addSource(id, {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: route.geometry
      }
    });

    map.addLayer({
      id,
      type: 'line',
      source: id,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': i === 0 ? '#10b981' : '#3b82f6',
        'line-width': i === 0 ? 5 : 3,
        'line-opacity': 0.8
      }
    });

    route.geometry.coordinates.forEach(coord => bounds.extend(coord));

    const distance = route.distance / 1000;
    const fuel = calculateFuel(distance, payload, vehicleType);
    const eta = calculateETA(distance, vehicleType);

    const box = document.createElement('div');
    box.className = 'route-box';
    box.innerHTML = `
      <strong>Route ${i + 1}</strong><br/>
      Fuel Required: ${fuel} L<br/>
      Distance: ${distance.toFixed(2)} km<br/>
      ETA: ${eta} hrs<br/>
      Vehicle Type: ${vehicleType}<br/>
      Load: ${payload} kg
      <br/><button onclick="window.dispatchEvent(new CustomEvent('routeSelected', { detail: ${i} }))">Select Route</button>

    `;// ...abhi added button to select route and gets hide
    comparisonDiv.appendChild(box);
  });

  map.fitBounds(bounds, { padding: 50 });
}

window.highlightRoute = function (index) {
  const selectedRoute = currentRoutes[index].route;
  const routeBounds = new mapboxgl.LngLatBounds();
  selectedRoute.geometry.coordinates.forEach(coord => routeBounds.extend(coord));
  map.fitBounds(routeBounds, { padding: 100 });

  currentRoutes.forEach((r, i) => {
    map.setPaintProperty(r.id, 'line-color', i === index ? '#ffffff' : '#3b82f6');
    map.setPaintProperty(r.id, 'line-width', i === index ? 6 : 2);
    map.setPaintProperty(r.id, 'line-opacity', i === index ? 1 : 0.3);
  });
};

export default RoutePlanner;
