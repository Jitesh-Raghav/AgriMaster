import React, { useState, useEffect } from 'react';
import './Data.scss';

const API_KEY = '34ec8e7064563f9302b0181248da6723'; // Replace with your API key

const DataForm = () => {
  const [locationData, setLocationData] = useState({
    latitude: '',
    longitude: '',
    temperature: '',
    moisture: '',
    rainfall: ''
  });

  const [soilData, setSoilData] = useState({
    nitrogen: '',
    phosphorus: '',
    potassium: ''
  });

  const [errorMessage, setErrorMessage] = useState('');

  // Automatically get location data using browser API
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setLocationData(prev => ({ ...prev, latitude, longitude }));
        fetchWeatherData(latitude, longitude);
      }, (error) => {
        setErrorMessage('Location access denied.');
      });
    } else {
      setErrorMessage('Geolocation is not supported by your browser.');
    }
  }, []);

  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
  
      if (data && data.main) {
        // Ensure `main` object and properties exist
        setLocationData(prev => ({
          ...prev,
          temperature: data.main.temp || 'N/A', // Default to 'N/A' if temp is not available
          moisture: data.main.humidity || 'N/A', // Default to 'N/A'
          rainfall: (data.rain && data.rain['1h']) ? data.rain['1h'] : 0 // Check if rainfall exists
        }));
      } else {
        setErrorMessage('Failed to retrieve weather data.');
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setErrorMessage('Failed to fetch weather data.');
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in locationData) {
      setLocationData({ ...locationData, [name]: value });
    } else {
      setSoilData({ ...soilData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Crop suggestion generated!');
  };

  return (
    <div className="form-container">
      <h2>Weather Data</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Latitude</label>
          <input
            type="text"
            name="latitude"
            value={locationData.latitude}
            onChange={handleChange}
            placeholder="Latitude"
          />
        </div>

        <div className="input-group">
          <label>Longitude</label>
          <input
            type="text"
            name="longitude"
            value={locationData.longitude}
            onChange={handleChange}
            placeholder="Longitude"
          />
        </div>

        <div className="input-group">
          <label>Temperature (°C)</label>
          <input
            type="text"
            name="temperature"
            value={locationData.temperature}
            onChange={handleChange}
            placeholder="Temperature"
          />
        </div>

        <div className="input-group">
          <label>Moisture (%)</label>
          <input
            type="text"
            name="moisture"
            value={locationData.moisture}
            onChange={handleChange}
            placeholder="Moisture"
          />
        </div>

        <div className="input-group">
          <label>Rainfall (mm)</label>
          <input
            type="text"
            name="rainfall"
            value={locationData.rainfall}
            onChange={handleChange}
            placeholder="Rainfall"
          />
        </div>

        <h2>Soil Data</h2>

        <div className="input-group">
          <label>Nitrogen (N)</label>
          <input
            type="text"
            name="nitrogen"
            value={soilData.nitrogen}
            onChange={handleChange}
            placeholder="Nitrogen"
          />
        </div>

        <div className="input-group">
          <label>Phosphorus (P)</label>
          <input
            type="text"
            name="phosphorus"
            value={soilData.phosphorus}
            onChange={handleChange}
            placeholder="Phosphorus"
          />
        </div>

        <div className="input-group">
          <label>Potassium (K)</label>
          <input
            type="text"
            name="potassium"
            value={soilData.potassium}
            onChange={handleChange}
            placeholder="Potassium"
          />
        </div>

        <button type="submit" className="submit-btn">
          Suggest Crops
        </button>
      </form>
    </div>
  );
};

export default DataForm;
