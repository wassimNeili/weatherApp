import React, { useEffect, useReducer, useCallback } from 'react';
import './App.css';
import weatherLogo from './img/weather-logo.png';
import axios from 'axios';

const initialState = {
  weatherData: null,
  city: '',
  showWeather: false,
  loading: false,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_CITY':
      return { ...state, city: action.payload };
    case 'TOGGLE_SHOW_WEATHER':
      return { ...state, showWeather: !state.showWeather };
    case 'FETCH_WEATHER_REQUEST':
      return { ...state, loading: true, error: null };
    case 'FETCH_WEATHER_SUCCESS':
      return { ...state, loading: false, weatherData: action.payload };
    case 'FETCH_WEATHER_FAILURE':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const WeatherApp = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { weatherData, city, showWeather, loading, error } = state;

  const apiKey = '12b7bce13f147581cf0a825f68d36c34';

  const fetchData = useCallback(async () => {
    dispatch({ type: 'FETCH_WEATHER_REQUEST' });

    try {
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
      const response = await axios.get(apiUrl);
      const jsonData = response.data;

      dispatch({ type: 'FETCH_WEATHER_SUCCESS', payload: jsonData });
    } catch (error) {
      dispatch({ type: 'FETCH_WEATHER_FAILURE', payload: error.message });
    }
  }, [city]);

  const handleSearch = () => {
    dispatch({ type: 'TOGGLE_SHOW_WEATHER' });
    if (city.trim() !== '') {
      fetchData();
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  useEffect(() => {
    if (showWeather) {
      fetchData();
    }
  }, [showWeather, fetchData]);

  return (
    <div className="container">
      <img src={weatherLogo} alt="Weather Logo" className="logo" />
      <h1>Weather App</h1>

      <form onSubmit={handleFormSubmit}>
        <div className="search-container">
          <input
            type="text"
            value={city}
            onChange={(e) => dispatch({ type: 'SET_CITY', payload: e.target.value })}
            placeholder="Enter city name"
          />
          <button type="submit">Search</button>
        </div>
      </form>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">Error: {error}</div>}

      {showWeather && weatherData && (
        <div>
          <h2>{weatherData.name}, {weatherData.sys.country}</h2>
          <p>Temperature: {Math.round(weatherData.main.temp - 273.15)}°C</p>
          <p>Description: {weatherData.weather[0].description}</p>
          <p>Humidity: {(weatherData.main.humidity) / 2}%</p>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
