import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_KEY } from '../constants';
import { metric_units, weekdays, months } from '../constants';

function Forecast() {
  const [forecastData, setForecastData] = useState({});
  const [forecastList, setForecastList] = useState([]);

  const itemsAt12 = [];
  const itemsAt00 = [];

  const searchForecast = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${API_KEY}&units=${metric_units}`
          )
          .then((response) => setForecastList(response.data.list))
          .catch((error) => {
            console.error('API call error:', error);
          });
      });
    }
  };
  console.log(forecastList);

  forecastList.forEach((item, index) => {
    if (item.dt_txt.includes('12:00')) {
      // For items with "12:00", add to the itemsAt12 array
      itemsAt12.push(item);
    } else if (item.dt_txt.includes('00:00')) {
      // For items with "00:00", add to the itemsAt00 array
      itemsAt00.push(item);
    }
  });

  const filteredItems = forecastList.map((item, index) => {
    // Checks if the item's time contains "12:00"
    if (item.dt_txt.includes('12:00')) {
      let localDay = new Date(item.dt * 1000).getUTCDay();
      let localDate = new Date(item.dt * 1000).getUTCDate();
      let localMonth = new Date(item.dt * 1000).getUTCMonth();

      console.log(localDay);

      // Returns div with weather info for every iteration
      return (
        <div key={index} className="forecast-div">
          {/* Render the item */}
          <p className="forecast-date">
            {weekdays[localDay].substring(0, 3)}, {localDate} {months[localMonth]}
          </p>
          <div className="forecast-temp-and-icon-div">
            <p className="forecast-temp">{item.main.temp.toFixed()} °C</p>
            <img
              className="forecast-icon"
              src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
              alt="weather icon"
            ></img>
          </div>
        </div>
      );
    } else {
      // Return null for items that don't match the condition
      return null;
    }
  });

  useEffect(() => {
    searchForecast();
  }, []);

  return (
    <div>
      <span className="forecast-heading">10 DAY FORECAST</span>
      <span>{filteredItems}</span>
      <span>{}</span>
    </div>
  );
}

export default Forecast;
