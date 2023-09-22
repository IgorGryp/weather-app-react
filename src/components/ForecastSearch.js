import axios from 'axios';
import React, { useEffect } from 'react';
import { API_KEY, metric_units } from '../constants';

function ForecastSearch({ locationId, setForecastList }) {
  useEffect(() => {
    if (locationId !== null) {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/forecast?id=${locationId}&appid=${API_KEY}&units=${metric_units}`
        )
        .then((response) => {
          setForecastList(response.data.list);
          console.log(response.data);
        })
        .catch((error) => {
          console.error('API call error:', error);
        });
    }
  }, [locationId]); // eslint-disable-line

  return <div></div>;
}

export default ForecastSearch;
