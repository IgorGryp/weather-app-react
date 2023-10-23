import axios from 'axios';
import { useEffect } from 'react';
import { API_KEY } from '../../constants';

function ForecastSearch({ locationId, setForecastList, units }) {
  useEffect(() => {
    if (locationId !== null) {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/forecast?id=${locationId}&appid=${API_KEY}&units=${units}`
        )
        .then((response) => {
          setForecastList(response.data.list);
          console.log(response.data);
        })
        .catch((error) => {
          console.error('API call error:', error);
        });
    }
  }, [locationId, units]); // eslint-disable-line
}

export default ForecastSearch;
