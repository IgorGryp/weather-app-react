import { weekdays } from '../constants';
import ForecastSearch from './ForecastSearch';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

function Forecast({ forecastList, setForecastList, locationId, data }) {
  // Initializes two arrays to store forecast data that match the conditions with the times "12:00" and "00:00"
  const itemsAt12 = [];
  const itemsAt00 = [];
  // Initializes array to store elements with forecast data that displays for the user
  let forecastItems = [];

  console.log(forecastList);

  // Iterates through the forecastList and collects objects with weather data that match the times "12:00" and "00:00"
  forecastList.forEach((item) => {
    if (item.dt_txt.includes('12:00:00')) {
      /* console.log(item); */
      itemsAt12.push(item);
    } else if (item.dt_txt.includes('00:00:00')) {
      /* console.log(item); */
      itemsAt00.push(item);
    }
  });

  // Iterates through both arrays with wether data simultaneously, creating HTML elements with forecast containing the highest and lowest temperatures of the day and storing them in the state
  for (let i = 0; i < Math.max(itemsAt00.length, itemsAt12.length); i++) {
    let itemAt12 = itemsAt12[i];
    let itemAt00 = itemsAt00[i];

    let localDay = new Date(itemAt12.dt * 1000).getUTCDay();
    let localDate = new Date(itemAt12.dt * 1000).getUTCDate();

    // Stores HTML elements with forecast in the array

    forecastItems.push(
      <SwiperSlide key={itemAt12.dt} className="forecast-container">
        <div className="forecast-date-container">
          <p className="forecast-date">
            {weekdays[localDay].substring(0, 3)} {localDate}
          </p>
        </div>
        <div className="forecast-temp-and-icon-container">
          <div className="forecast-temp-container">
            <p className="forecast-temp">{itemAt12.main.temp.toFixed()}°</p>
            <p className="forecast-temp">{itemAt00.main.temp.toFixed()}°</p>
          </div>
          <img
            className="forecast-icon"
            src={`https://openweathermap.org/img/wn/${itemAt12.weather[0].icon}@2x.png`}
            alt="weather icon"
          ></img>
        </div>
      </SwiperSlide>
    );
  }

  // Displays forecast component
  return (
    <section className="forecast-wrapper">
      <div>
        <h3 className="forecast-heading">10 DAY FORECAST</h3>
      </div>
      <Swiper
        spaceBetween={10}
        slidesPerView={4}
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}
      >
        <div className="forecast-items">{forecastItems}</div>
      </Swiper>

      <ForecastSearch locationId={locationId} setForecastList={setForecastList} />
    </section>
  );
}

export default Forecast;
