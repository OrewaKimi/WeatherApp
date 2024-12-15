import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

export default function Weather() {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState(null);

    const handleCityChange = (event) => {
        setCity(event.target.value);
    }

    const fetchWeather = async () => {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=2411839da5462e857c3205414fcd7c8c`);
            setWeather(response);
            fetchForecast(response.data.coord.lat, response.data.coord.lon); // Ambil prakiraan cuaca
        } catch (error) {
            console.log("Error fetching weather data", error);
        }
    }

    const fetchForecast = async (lat, lon) => {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=2411839da5462e857c3205414fcd7c8c`);
            setForecast(response.data);
        } catch (error) {
            console.log("Error fetching forecast data", error);
        }
    }

    const handleClick = () => {
        fetchWeather();
    }

    return (
        <div className='weather-container'>
            <h2>Weather App</h2>
            <input 
                type='text' 
                placeholder='Enter City Name' 
                value={city} 
                onChange={handleCityChange} 
            />
            <button onClick={handleClick}>Get Weather</button>
            {weather && (
                <div className='weather-info'>
                    <h3>{weather.data.name}</h3>
                    <p>Temp: {Math.round(weather.data.main.temp - 273.15)}°C</p>
                    <p>{weather.data.weather[0].description}</p>
                    <img src={`http://openweathermap.org/img/wn/${weather.data.weather[0].icon}.png`} alt={weather.data.weather[0].description} />
                </div>
            )}
            {forecast && (
                <div className='forecast-info'>
                    <h4>5-Day Forecast</h4>
                    <ul>
                        {forecast.list.slice(0, 5).map((item, index) => (
                            <li key={index}>
                                {new Date(item.dt * 1000).toLocaleDateString()} - Temp: {Math.round(item.main.temp - 273.15)}°C - {item.weather[0].description}
                                <img src={`http://openweathermap.org/img/wn/${item.weather[0].icon}.png`} alt={item.weather[0].description} />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}