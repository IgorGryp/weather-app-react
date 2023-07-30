import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_KEY, metric_units, months, weekdays } from './constants';
import PuffLoader from 'react-spinners/PuffLoader';

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');

  // Gets users location, creates and saves the URL with users location by latitude and longitude
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          axios
            .get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=${metric_units}`
            )
            .then((response) => {
              console.log(response.data);
              setData(response.data);
            })
            .catch((error) => {
              // TODO: Fix better user error message
              console.error('API call error:', error);
            });
        },
        (error) => {
          alert('Error getting user location:', error);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
    // eslint-disable-next-line
  }, []);

  console.log(data.name);

  // Gets data for entered location from API and sets the response data to the state
  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?&q=${location}&appid=${API_KEY}&units=${metric_units}`
        )
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          // TODO: Fix better user error message
          console.error('API call error:', error);
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

  // Doesn't use getUTCMinutes() because of showing wrong time
  // let localMinutes = new Date().getMinutes();

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
        />
      </section>

      {Object.keys(data).length === 0 ? (
        <PuffLoader color={'#ffffff'} size={200} className='loader' />
      ) : (
        <div className='content'>
          {/* ********** TOP-SECTION ********** */}
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

          {/* ********** BOTTOM-SECTION ********** */}
          {/* Humidity - Pressure - Wind */}

          {data.name !== undefined && (
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
          )}
        </div>
      )}
    </div>
  );
}

export default App;
