import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { metric_units, weekdays, months } from '../constants';
import { API_KEY } from '../constants';

function Fcf() {
  // Initialize two arrays to store items that match the conditions
  const itemsAt12 = [];
  const itemsAt00 = [];

  let filteredItems = [];

  const [forecastList, setForecastList] = useState([]);

  useEffect(() => {
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
  }, []);
  console.log(forecastList);

  // Iterate through forecastList and collect items that match "00:00" and "12:00"
  forecastList.forEach((item) => {
    if (item.dt_txt.includes('12:00:00')) {
      console.log(item);
      itemsAt12.push(item);
    } else if (item.dt_txt.includes('00:00:00')) {
      console.log(item);
      itemsAt00.push(item);
    }
  });

  // Iterate through both arrays simultaneously and render two items at a time
  for (let i = 0; i < Math.max(itemsAt00.length, itemsAt12.length); i++) {
    let itemAt12 = itemsAt12[i];
    let itemAt00 = itemsAt00[i];

    let localDay = new Date(itemAt12.dt * 1000).getUTCDay();
    let localDate = new Date(itemAt12.dt * 1000).getUTCDate();
    let localMonth = new Date(itemAt12.dt * 1000).getUTCMonth();

    filteredItems.push(
      <div key={itemAt12.dt} className="forecast-container">
        <div className="forecast-date-container">
          <p className="forecast-date">
            {weekdays[localDay].substring(0, 3)}, {localDate} {months[localMonth]}
          </p>
        </div>
        <div className="forecast-temp-and-icon-container">
          <div className="forecast-temp-container">
            <p className="forecast-temp">{itemAt12.main.temp.toFixed()} °</p>
            <p className="forecast-temp">{itemAt00.main.temp.toFixed()} °</p>
          </div>
          <img
            className="forecast-icon"
            src={`https://openweathermap.org/img/wn/${itemAt12.weather[0].icon}@2x.png`}
            alt="weather icon"
          ></img>
        </div>
      </div>
    );

    /*     if (itemAt00) {
      filteredItems.push(renderItem(itemAt00));
    }

    if (itemAt12) {
      filteredItems.push(renderItem(itemAt12));
    } */
  }

  return (
    <div className="forecast-wrapper">
      <div>
        <h3 className="forecast-heading">10 DAY FORECAST</h3>
      </div>
      <div className="forecast-items">{filteredItems}</div>
    </div>
  );
}

export default Fcf;
