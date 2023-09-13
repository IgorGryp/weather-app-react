import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_KEY, metric_units, months, weekdays } from './constants';
import PuffLoader from 'react-spinners/PuffLoader';
import Modal from './components/Modal';
import CityList from './components/CityList';
import LocationButton from './components/LocationButton';
import Forecast from './components/Forecast';
import FC from './components/FC';
import searchImg from './assets/search.png';

function App() {
  const [data, setData] = useState({});
  const [userInput, setUserInput] = useState('');
  const [location, setLocation] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [inputIsDisabled, setInputIsDisabled] = useState(false);
  const [locationList, setLocationList] = useState([]);
  const [countryCode, setCountryCode] = useState([]);
  const [locationId, setLocationId] = useState(null);

  // Gets users location. Creates the URL with users location by latitude and longitude.
  // Gets the data from API and sets the response data to the state.

  const searchUserLacation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          axios
            .get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${API_KEY}&units=${metric_units}`
            )
            .then((response) => {
              setData(response.data);
              console.log(response.data);
            })
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

  // Runs the function to identify the user's location
  useEffect(() => {
    searchUserLacation();
  }, []);

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
    <div className="App">
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
        data={data}
        setData={setData}
        setOpenModal={setOpenModal}
        setUserInput={setUserInput}
      />

      {Object.keys(data).length === 0 ? (
        /* Spinner from react-spinners by David Hu */
        <PuffLoader color={'#ffffff'} size={200} className="loader" />
      ) : (
        <div className="content">
          {/* ********** TOP SECTION ********** */}
          {/* Location - Country - Date - Time - Temp - Icon - Description - Feels like */}
          <section className="top-section">
            <div className="location">
              <p>{data.name}</p>
              {data.sys && <p>, {data.sys.country}</p>}
            </div>

            <div className="date-time">
              {
                <p className="date">
                  {weekdays[localDay]}, {months[localMonth]} {localDate}
                </p>
              }
              {
                <p className="time">
                  {localHours < 10 ? '0' + localHours : '' + localHours}:
                  {localMinutes < 10 ? '0' + localMinutes : '' + localMinutes}
                </p>
              }
            </div>

            <div className="temp-icon">
              <div className="temp">{data.main && <h1>{data.main.temp.toFixed()} °C</h1>}</div>
              <div className="icon-div">
                {data.weather && (
                  <img
                    className="icon"
                    src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                    alt="weather icon"
                  ></img>
                )}
              </div>
              <div className="description">
                {data.weather && <p>{data.weather[0].description}</p>}
              </div>
            </div>

            <div className="description-feels-like">
              <div className="feels-like">
                {data.main && <p>Feels like {data.main.feels_like.toFixed()} °C</p>}
              </div>
            </div>
          </section>

          {/* ********** BOTTOM SECTION ********** */}
          {/* Humidity - Pressure - Wind */}
          <section className="bottom-section">
            <div className="humidity">
              <p>Humidity</p>
              {data.main && <p>{data.main.humidity} %</p>}
            </div>

            <div className="pressure">
              <p>Pressure</p>
              {data.main && <p>{data.main.pressure} mb</p>}
            </div>

            <div className="wind">
              <p>Wind</p>
              {data.wind && <p>{data.wind.speed.toFixed()} m/s</p>}
            </div>
          </section>
        </div>
      )}

      <Modal
        openModal={openModal}
        setOpenModal={setOpenModal}
        setInputIsDisabled={setInputIsDisabled}
      />
      {/* <Forecast /> */}
      <FC />
    </div>
  );
}

export default App;
