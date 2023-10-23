import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_KEY, metric_units, imperial_units, months, weekdays } from './constants';
import PuffLoader from 'react-spinners/PuffLoader';
import Modal from './components/Modal/Modal';
import CityList from './components/CityList/CityList';
import LocationButton from './components/LocationButton/LocationButton';
import searchImg from './assets/search.png';
import Forecast from './components/Forecast/Forecast';
import Logos from './components/Logos/Logos';
import UnitsSwitcher from './components/UnitsSwitcher/UnitsSwitcher';

function App() {
  const [data, setData] = useState({});
  const [userInput, setUserInput] = useState('');
  const [location, setLocation] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [inputIsDisabled, setInputIsDisabled] = useState(false);
  const [locationList, setLocationList] = useState([]);
  const [countryCode, setCountryCode] = useState([]);
  const [locationId, setLocationId] = useState(null);
  const [forecastList, setForecastList] = useState([]); // State to store fetched forecast data
  const [metricUnits, setMetricUnits] = useState(true);

  const units = metricUnits ? metric_units : imperial_units;
  console.log(units);

  // Identifies the user's location.
  // Fetches current weather data and forecast data from APIs and sets them to the states
  const searchUserLacation = () => {
    setLocationId(null); // Deletes previous location ID when returning to start page by clicking Location Button
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Fetches current weather data
          axios
            .get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${API_KEY}&units=${units}`
            )
            .then((response) => {
              setData(response.data);
              console.log(response.data.name);
            })
            .catch((error) => {
              console.error('API call error:', error);
            });
          // Fetches forecast data
          axios
            .get(
              `https://api.openweathermap.org/data/2.5/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${API_KEY}&units=${units}`
            )
            .then((response) => setForecastList(response.data.list))
            .catch((error) => {
              console.error('API call error:', error);
            });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  // Runs the function to identify the user's location at first render and evry time units changes
  useEffect(() => {
    if (locationId === null) searchUserLacation();
  }, [units]); // eslint-disable-line

  // Gets local date end time
  let localDay = new Date((data.dt + data.timezone) * 1000).getUTCDay();
  let localDate = new Date((data.dt + data.timezone) * 1000).getUTCDate();
  let localMonth = new Date((data.dt + data.timezone) * 1000).getUTCMonth();
  let localHours = new Date((data.dt + data.timezone) * 1000).getUTCHours();
  let localMinutes = new Date((data.dt + data.timezone) * 1000).getUTCMinutes();

  // getUTCMinutes() is not working correctly and shows wrong minutes for different locations.
  // The possible explanation could be that the data in the API is not updated live but with a certain delay.
  // To work around this problem, you can use the local time of your own location.
  // let localMinutes = new Date().getMinutes();

  // Disables input field in case of incorrect user input and the Modal component opens.
  useEffect(() => {
    if (openModal) setInputIsDisabled(true);
  }, [openModal]);

  // Calls City list by pressing Enter
  const getCityList = (event) => {
    if (event.key === 'Enter') {
      setLocation(userInput);
    }
  };

  // Calls City list with button click
  const getCityListByButtonClick = () => {
    setLocation(userInput);
  };

  /* **************************************************************************************************** */

  return (
    <main className="App">
      {/* ********** SEARCH BAR ********** */}
      <section className="search-bar">
        <div className="search-bar-container">
          <input
            id="location"
            value={userInput}
            placeholder="Search City"
            type="text"
            disabled={inputIsDisabled}
            onChange={(event) => setUserInput(event.target.value)}
            onKeyDown={getCityList}
          />
          <div className="search-button-container" onClick={getCityListByButtonClick}>
            <img src={searchImg} alt="search button" className="search-button"></img>
          </div>
        </div>

        <LocationButton searchUserLacation={searchUserLacation} />
      </section>

      <CityList
        location={location}
        setLocation={setLocation}
        locationList={locationList}
        setLocationList={setLocationList}
        countryCode={countryCode}
        setCountryCode={setCountryCode}
        locationId={locationId}
        setLocationId={setLocationId}
        setData={setData}
        setOpenModal={setOpenModal}
        setUserInput={setUserInput}
        units={units}
      />

      {Object.keys(data).length === 0 ? (
        /* Spinner from react-spinners by David Hu */
        <PuffLoader color={'#ffffff'} size={200} className="PuffLoader" />
      ) : (
        <section className="content">
          {/* ********** MAIN WEATHER SECTION ********** */}
          <section className="main-weather-section">
            <UnitsSwitcher metricUnits={metricUnits} setMetricUnits={setMetricUnits} />
            <div className="location">
              <h2>{data.name}</h2>
              <h2>, {data.sys.country}</h2>
            </div>
            <div className="date-time">
              <p className="date">
                {weekdays[localDay]}, {months[localMonth]} {localDate}
              </p>
              <p className="time">
                {localHours < 10 ? '0' + localHours : '' + localHours}:
                {localMinutes < 10 ? '0' + localMinutes : '' + localMinutes}
              </p>
            </div>
            <div className="temp-icon-container">
              <div className="temp">
                <p>{data.main.temp.toFixed()}°C</p>
              </div>
              <div className="icon-container">
                <img
                  className="icon"
                  src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                  alt="weather icon"
                ></img>
              </div>
              <div className="weather-description-container">
                <p className="weather-description">{data.weather[0].description}</p>
                <p className="feels-like">Feels like {data.main.feels_like.toFixed()} °C</p>
              </div>
            </div>
            {/* ********** ADDITIONAL WEATHER INFO SECTION ********** */}
            <div className="additional-weather-info-section">
              <div className="humidity">
                <p className="humidity-heading">Humidity</p>
                <p className="humidity-data">{data.main.humidity} %</p>
              </div>

              <div className="pressure">
                <p className="pressure-heading">Pressure</p>
                <p className="pressure-data">{data.main.pressure} mb</p>
              </div>

              <div className="wind">
                <p className="wind-heading">Wind</p>
                <p className="wind-data">{data.wind.speed.toFixed()} m/s</p>
              </div>

              <div className="visibility">
                <p className="visibility-heading">Visibility</p>
                <p className="visibility-data">{data.visibility / 1000} km</p>
              </div>
            </div>
          </section>

          <Forecast
            forecastList={forecastList}
            setForecastList={setForecastList}
            locationId={locationId}
            location={location}
            data={data}
            units={units}
          />
        </section>
      )}

      <Logos />

      <Modal
        openModal={openModal}
        setOpenModal={setOpenModal}
        setInputIsDisabled={setInputIsDisabled}
      />
    </main>
  );
}

export default App;
