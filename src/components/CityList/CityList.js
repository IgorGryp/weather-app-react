import axios from 'axios';
import { useEffect } from 'react';
import { API_KEY, metric_units } from '../../constants';
import WeatherSearch from '../WeatherSearch/WeatherSearch';
import './CityList.scss';

function CityList({
  location,
  setLocation,
  locationList,
  setLocationList,
  locationId,
  setLocationId,
  setData,
  setOpenModal,
  setUserInput,
  units,
}) {
  // Fetching the list of matching cities
  useEffect(() => {
    location && // Checks if there any user input before request
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/find?&q=${location}&appid=${API_KEY}&units=${units}`
        )
        .then((response) => {
          console.log(response.data.list);
          if (response.data.count !== 0) {
            const newLocations = response.data.list.map((element) => element); // Saves the list of matched cities to the variable
            console.log(newLocations);
            setLocationList(newLocations); // Sets the list off matched cities to the state
            /* setLocationList((prevLocationList) => [...prevLocationList, ...newLocations]); */
          } else {
            console.error('No matches found for the provided city.');
            setOpenModal(true); // Shows Error Modal if receiving an empty array. API behavior
            setLocationList([]); // Closes the list of cities
          }
        })
        .catch((error) => {
          console.error('Error fetching data: ', error);
          setOpenModal(true); // Shows Error Modal if request fails
          setLocationList([]); // Closes the list of cities
        });
  }, [location, setLocationList, setOpenModal, units]);

  // Handles click event on city from city list
  const handleClick = (itemId) => {
    setLocationId(itemId); // Sets id for the selected location
    setLocationList([]); // Closes the list of cities
    setUserInput(''); // Clears the input field
  };

  return (
    <section className="CityList">
      {locationId !== 0 && (
        <div>
          <ul>
            {/* The list of matched cities */}
            {locationList.length > 0 &&
              locationList.map((item) => (
                <li
                  key={item.id}
                  onClick={() => {
                    handleClick(item.id);
                  }}
                >
                  <span className="location-suggestions">
                    {`${item.name}, ${item.sys.country}`}
                  </span>
                  <span>{item.main.temp.toFixed()} °C</span>
                  <img
                    className="location-uggestions-icon"
                    src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                    alt="weather icon"
                  ></img>
                </li>
              ))}
          </ul>

          <WeatherSearch
            locationId={locationId}
            setLocation={setLocation}
            setData={setData}
            setOpenModal={setOpenModal}
            units={units}
          />
        </div>
      )}
    </section>
  );
}

export default CityList;
