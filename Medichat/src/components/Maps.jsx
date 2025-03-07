import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";


const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
};

const formatTime = (hours) => {
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes} mins`;
  }
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  return `${wholeHours}h ${minutes}m`;
};

const hospitalIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2776/2776067.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const DEFAULT_LOCATION = [1.3733, 32.2903];

const Maps = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [zoomLevel, setZoomLevel] = useState(7);
  const [hospitals, setHospitals] = useState([]);
  const [searched, setSearched] = useState(false);

  const searchLocation = async () => {
    if (!searchQuery) return;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        setLocation([parseFloat(lat), parseFloat(lon)]);
        setZoomLevel(14);
        setSearched(true);
      } else {
        alert("Location not found. Try a different search.");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  useEffect(() => {
    if (!searched) return;

    const [lat, lon] = location;
    const overpassQuery = `[out:json];
      node["amenity"="hospital"](around:5000, ${lat}, ${lon});
      out;`;

    const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

    fetch(overpassUrl)
      .then((response) => response.json())
      .then((data) => {
        const hospitalList = data.elements.map((hospital) => ({
          id: hospital.id,
          lat: hospital.lat,
          lon: hospital.lon,
          name: hospital.tags.name || "Unknown Hospital",
          distance: calculateDistance(lat, lon, hospital.lat, hospital.lon),
        }));
        setHospitals(hospitalList);
      })
      .catch((error) => console.error("Error fetching hospitals:", error));
  }, [location, searched]);

  const ChangeMapView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(center, zoom);
    }, [center, zoom]);
    return null;
  };

  return (
    <div>
      <div className="input-group my-3 px-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter location (e.g., Kampala, Uganda)"
          className="form-control border-0 bg-light"
        />
        <button 
          className="btn btn-outline-secondary border-0 bg-light"
          onClick={searchLocation}>
          <i className="bi bi-search"></i>
        </button>
      </div>

      <MapContainer center={location} zoom={zoomLevel} className="leaflet-container" style={{ height: "500px", width: "100%" }}>
        <ChangeMapView center={location} zoom={zoomLevel} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        <Marker position={location}>
          <Popup>Searched Location</Popup>
        </Marker>

        {hospitals.map((hospital) => {
          const travelTime = formatTime(hospital.distance / 50);
          
          return (
            <Marker key={hospital.id} position={[hospital.lat, hospital.lon]} icon={hospitalIcon}>
              <Popup>
                <div className="hospital-popup">
                  <h6>{hospital.name}</h6>
                  <p>Distance: {hospital.distance.toFixed(1)} km</p>
                  <p>Approx. travel time: {travelTime}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default Maps;