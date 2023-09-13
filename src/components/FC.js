import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { metric_units, weekdays, months } from '../constants';
import { API_KEY } from '../constants';

function FC() {
  // Initialize two arrays to store items that match the conditions
  const itemsAt00 = [];
  const itemsAt12 = [];
  let filteredItems = [];

  const [forecastData, setForecastData] = useState({});
  const [forecastList, setForecastList] = useState([]);

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

  // Combine the two arrays for rendering
  const combinedItems = [...itemsAt00, ...itemsAt12];

  console.log(combinedItems);

  // Initialize an array to store JSX elements
  const renderedItems = [];

  // Iterate through combinedItems in pairs of two
  for (let i = 0; i < combinedItems.length; i += 2) {
    const item1 = combinedItems[i];
    const item2 = combinedItems[i + 1];

    // Render the pair of items in the same JSX structure
    if (item1) {
      renderedItems.push(renderItems(item1));
    }
    if (item2) {
      renderedItems.push(renderItems(item2));
    }
  }

  function renderItems(item) {
    let localDay = new Date(item.dt * 1000).getUTCDay();
    let localDate = new Date(item.dt * 1000).getUTCDate();
    let localMonth = new Date(item.dt * 1000).getUTCMonth();

    filteredItems.push(
      <div key={item.dt} className="forecast-div">
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
  }

  useEffect(() => {
    searchForecast();
  }, []);

  // Now, you can render renderedItems wherever you need in your JSX
  return (
    <div>
      <span className="forecast-heading">10 DAY FORECAST</span>
      <span>{filteredItems}</span>
    </div>
  );
}

export default FC;
