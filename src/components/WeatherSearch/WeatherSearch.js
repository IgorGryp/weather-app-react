// This component searches weather data for the clicked city by city id.
import axios from 'axios';
import { API_KEY, metric_units } from '../../constants';
import { useEffect } from 'react';

function WeatherSearch({ locationId, setLocation, setData, setOpenModal, units }) {
  // Gets data for entered location from API and sets the response data to the state
  useEffect(() => {
    if (locationId !== null) {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?id=${locationId}&appid=${API_KEY}&units=${units}`
        )
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.error('API call error:', error);
          /* Displays error message in modal in case of incorrect input */
          /* setOpenModal(true); */
        });
      setLocation('');
    }
  }, [locationId, setData, setLocation, units]);
}

export default WeatherSearch;
