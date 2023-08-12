import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_KEY, metric_units, months, weekdays } from './constants';
import PuffLoader from 'react-spinners/PuffLoader';
import Modal from './components/Modal';

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [inputIsDisabled, setInputIsDisabled] = useState(false);

  // Gets users location. Creates the URL with users location by latitude and longitude.
  // Gets the data from API and sets the response data to the state.
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          axios
            .get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=${metric_units}`
            )
            .then((response) => {
              setData(response.data);
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
  }, []);

  // Gets data for entered location from API and sets the response data to the state.
  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?&q=${location}&appid=${API_KEY}&units=${metric_units}`
        )
        .then((response) => {
          setData(response.data);
          console.log(response.data.name);
        })
        .catch((error) => {
          console.error('API call error:', error);
          /* Displays error message in modal in case of incorrect input */
          setOpenModal(true);
        });
      setLocation('');
    }
  };

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

  /* **************************************************************************************************** */

  return (
    <div className='App'>
      {/* ********** SEARCH BAR ********** */}
      <section className='search-bar'>
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder='Search City'
          type='text'
          disabled={inputIsDisabled}
        />
      </section>
      {Object.keys(data).length === 0 ? (
        /* Loading spinner from react-spinners by David Hu */
        <PuffLoader color={'#ffffff'} size={200} className='loader' />
      ) : (
        <div className='content'>
          {/* ********** TOP SECTION ********** */}
          {/* Location - Country - Date - Time - Temp - Icon - Description - Feels like */}
          <section className='top-section'>
            <div className='location'>
              <p>{data.name}</p>
              {data.sys && <p>, {data.sys.country}</p>}
            </div>

            <div className='date-time'>
              {
                <p className='date'>
                  {weekdays[localDay]}, {months[localMonth]} {localDate}
                </p>
              }
              {
                <p className='time'>
                  {localHours < 10 ? '0' + localHours : '' + localHours}:
                  {localMinutes < 10 ? '0' + localMinutes : '' + localMinutes}
                </p>
              }
            </div>

            <div className='temp-icon'>
              <div className='temp'>
                {data.main && <h1>{data.main.temp.toFixed()} °C</h1>}
              </div>
              <div className='icon-div'>
                {data.weather && (
                  <img
                    className='icon'
                    src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                    alt='weather icon'
                  ></img>
                )}
              </div>
              <div className='description'>
                {data.weather && <p>{data.weather[0].description}</p>}
              </div>
            </div>

            <div className='description-feels-like'>
              <div className='feels-like'>
                {data.main && (
                  <p>Feels like {data.main.feels_like.toFixed()} °C</p>
                )}
              </div>
            </div>
          </section>

          {/* ********** BOTTOM SECTION ********** */}
          {/* Humidity - Pressure - Wind */}
          <section className='bottom-section'>
            <div className='humidity'>
              {data.main && <p className='bold'>{data.main.humidity} %</p>}
              <p>Humidity</p>
            </div>

            <div className='pressure'>
              {data.main && <p className='bold'>{data.main.pressure} mb</p>}
              <p>Pressure</p>
            </div>

            <div className='wind'>
              {data.wind && (
                <p className='bold'>{data.wind.speed.toFixed()} m/s</p>
              )}
              <p>Wind</p>
            </div>
          </section>
        </div>
      )}

      <Modal
        openModal={openModal}
        setOpenModal={setOpenModal}
        setInputIsDisabled={setInputIsDisabled}
      />
    </div>
  );
}

export default App;
